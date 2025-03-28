import type { AstroIntegration } from "astro";
import { algoliasearch } from "algoliasearch";
import { loadEnv } from "vite";
import { glob } from "glob";
import { fileURLToPath } from "node:url";
import fs from "fs/promises";
import path from "node:path";
import * as cheerio from "cheerio";
import stopword from "stopword";

export default function pagefind(): AstroIntegration {
  return {
    name: "algolia",
    hooks: {
      "astro:build:done": async ({ logger, dir }) => {
        const {
          PUBLIC_ALGOLIA_APP_ID,
          ALGOLIA_WRITE_API_KEY,
          PUBLIC_ALGOLIA_INDEX_NAME,
        } = loadEnv(process.env.NODE_ENV ?? "", process.cwd(), "");
        const search = algoliasearch(
          PUBLIC_ALGOLIA_APP_ID ?? "",
          ALGOLIA_WRITE_API_KEY ?? "",
        );
        const pathToRead = fileURLToPath(dir);
        const globResult = await glob("**/*.html", {
          cwd: pathToRead,
          ignore: ["page-views/**", "search/**"],
        });

        for (const file of globResult) {
          const filePath = path.join(pathToRead, file);
          const fileContent = await fs.readFile(filePath, "utf-8");

          // Parse HTML
          const $ = cheerio.load(fileContent);
          const title = $("h1").text().replace(/\s+/g, " ").trim();

          // Remove <script>, <footer> and <style> content
          $("script, style, footer, pre, [data-pagefind-ignore]").remove();

          // Extract text and clean up whitespace
          let text = $("body").text();
          // Normalize whitespace: replace multiple spaces, newlines, and tabs with a single space
          text = text.replace(/\s+/g, " ").trim();
          let words = text.split(/\s+/);

          // Remove stopwords to avoid hitting record size limits
          words = stopword.removeStopwords(words);

          // Convert back to a string
          const content = words.join(" ");

          try {
            await search.partialUpdateObject({
              createIfNotExists: true,
              objectID:
                file === "index.html"
                  ? "home"
                  : file.replace("/index.html", ""),
              attributesToUpdate: {
                content,
                title: file === "index.html" ? "Homepage" : title,
              },
              indexName: PUBLIC_ALGOLIA_INDEX_NAME ?? "",
            });
          } catch (e) {
            logger.error("Error updating Algolia index for file: " + file);
          }
        }
      },
    },
  };
}
