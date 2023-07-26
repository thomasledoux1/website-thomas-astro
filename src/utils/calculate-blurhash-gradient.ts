import { encode } from "blurhash";
import { getPixels } from "@unpic/pixels";
import { blurhashToCssGradientString } from "@unpic/placeholder";

const calculateBlurhashGradient = async (url: string) => {
  const jpgData = await getPixels(
    url.replace("/upload", "/upload/w_100,q_auto,f_jpg,e_blur:1000"),
  );
  const data = Uint8ClampedArray.from(jpgData.data);
  const blurhash = encode(data, jpgData.width, jpgData.height, 4, 4);
  const cssGradient = blurhashToCssGradientString(blurhash);
  return cssGradient;
};

export { calculateBlurhashGradient };
