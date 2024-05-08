import { defineMiddleware } from "astro:middleware";
import { decrypt } from "./lib/vercel-flags-port.mjs";

// `context` and `next` are automatically typed
export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();
  const featureFlagOverrideCookie = context.cookies.get(
    "vercel-flag-overrides",
  )?.value;
  console.log(
    featureFlagOverrideCookie,
    context.url.pathname,
    context.url.pathname === "/",
  );
  if (featureFlagOverrideCookie && context.url.pathname === "/") {
    const decryptedFlags = (await decrypt(featureFlagOverrideCookie)) as {
      newFeature: boolean;
    };
    console.log("decryptedFlags", decryptedFlags);
    if (decryptedFlags.newFeature) {
      return context.redirect("/homepage-alternative-feature-flag");
    }
  }
  return response;
});
