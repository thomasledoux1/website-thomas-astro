/// <reference path="../.astro/actions.d.ts" />
/// <reference path="../.astro/db-types.d.ts" />
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

/** `@wterm/react` exports CSS without a `.d.ts`; side-effect imports need a module shim. */
declare module "@wterm/react/css";
