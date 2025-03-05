import type { AstroIntegration } from "astro";
import { algoliasearch } from "algoliasearch";
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
        const search = algoliasearch(
          import.meta.env.ALGOLIA_APP_ID,
          import.meta.env.ALGOLIA_WRITE_API_KEY,
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

          // Remove <script>, <footer> and <style> content
          $("script, style, footer").remove();

          // Extract text and clean up whitespace
          let text = $("body").text();

          // Normalize whitespace: replace multiple spaces, newlines, and tabs with a single space
          text = text.replace(/\s+/g, " ").trim();
          let words = text.split(/\s+/);

          // Remove stopwords to avoid hitting record size limits
          words = stopword.removeStopwords(words);

          // Convert back to a string
          let cleanedText = words.join(" ");

          try {
            await search.partialUpdateObject({
              createIfNotExists: true,
              objectID:
                file === "index.html"
                  ? "home"
                  : file.replace("/index.html", ""),
              attributesToUpdate: {
                content: cleanedText,
              },
              indexName: import.meta.env.ALGOLIA_INDEX_NAME,
            });
          } catch (e) {
            logger.error("Error updating Algolia index for file" + file);
          }
        }
      },
    },
  };
}
