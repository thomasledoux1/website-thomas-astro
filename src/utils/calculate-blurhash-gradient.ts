import { encode } from "blurhash";
import path from "path";
import { fileURLToPath } from "url";

import { promises as fs } from "node:fs";
import { getPixels } from "@unpic/pixels";
import { blurhashToCssGradientString } from "@unpic/placeholder";
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const calculateBlurhashGradient = async (url: string) => {
  const jpgData = await fs.readFile(
    path.resolve(
      __dirname,
      `../assets/${url.split("/").at(-1)?.split("?")[0]}`,
    ),
  );
  console.log(jpgData);
  const { data, width, height } = await getPixels(jpgData);
  const clampedArray = Uint8ClampedArray.from(data);
  const blurhash = encode(clampedArray, width, height, 4, 4);
  const cssGradient = blurhashToCssGradientString(blurhash);
  return cssGradient;
};

export { calculateBlurhashGradient };
