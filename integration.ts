import type { AstroIntegration } from "astro";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { createIndex, type PagefindServiceConfig } from "pagefind";
import sirv from "sirv";

/**
 * Pagefind Astro integration options.
 */
export interface PagefindOptions {
  /**
   * `PagefindServiceConfig` passed to pagefind's `createIndex`
   */
  indexConfig?: PagefindServiceConfig;
}

export default function pagefind({
  indexConfig,
}: PagefindOptions = {}): AstroIntegration {
  let outDir: string;
  return {
    name: "pagefind",
    hooks: {
      "astro:config:setup": ({ config, logger }) => {
        if (config.output === "server") {
          logger.warn(
            "Output type `server` does not produce static *.html pages in its output and thus will not work with astro-pagefind integration.",
          );
          return;
        }

        if (config.adapter?.name === "@astrojs/cloudflare") {
          outDir = fileURLToPath(
            new URL(config.base?.replace(/^\//, ""), config.outDir),
          );
        } else if (config.adapter?.name === "@astrojs/node") {
          outDir = fileURLToPath(config.build.client);
        } else {
          outDir = fileURLToPath(config.outDir);
        }
      },
      "astro:server:setup": ({ server, logger }) => {
        if (!outDir) {
          logger.warn(
            "astro-pagefind couldn't reliably determine the output directory. Search assets will not be served.",
          );
          return;
        }

        const serve = sirv(outDir, {
          dev: true,
          etag: true,
        });
        server.middlewares.use((req, res, next) => {
          if (req.url?.startsWith("/pagefind/")) {
            serve(req, res, next);
          } else {
            next();
          }
        });
      },
      "astro:build:done": async ({ dir, logger }) => {
        if (!outDir) {
          logger.warn(
            "astro-pagefind couldn't reliably determine the output directory. Search index will not be built.",
          );
          return;
        }

        const { index, errors: createErrors } = await createIndex(indexConfig);
        if (!index) {
          logger.error("Pagefind failed to create index");
          createErrors.forEach((e) => logger.error(e));
          return;
        }
        const pathToWrite = fileURLToPath(dir);
        const { page_count, errors: addErrors } = await index.addDirectory({
          path: outDir,
        });
        if (addErrors.length) {
          logger.error("Pagefind failed to index files");
          addErrors.forEach((e) => logger.error(e));
          return;
        } else {
          logger.info(`Pagefind indexed ${page_count} pages`);
        }
        const { outputPath, errors: writeErrors } = await index.writeFiles({
          outputPath: path.join(pathToWrite, "pagefind"),
        });
        if (writeErrors.length) {
          logger.error("Pagefind failed to write index");
          writeErrors.forEach((e) => logger.error(e));
          return;
        } else {
          logger.info(`Pagefind wrote index to ${outputPath}`);
        }
      },
    },
  };
}
