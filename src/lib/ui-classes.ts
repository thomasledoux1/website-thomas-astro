/**
 * Reusable Tailwind class groups for motion and surfaces.
 * Prefer importing these over ad-hoc duplicates.
 */
export const easeOutStrong = "ease-[cubic-bezier(0.23,1,0.32,1)]";

export const interactiveCard = [
  "transition-[border-color,box-shadow,transform]",
  "duration-200",
  easeOutStrong,
  "motion-reduce:hover:translate-y-0",
].join(" ");

/** Same as interactive card but no hover translate — avoids overflow/clipping inside horizontally scrollport (portfolio carousel). */
export const portfolioCard = [
  "transition-[border-color,background-color]",
  "duration-200",
  easeOutStrong,
  "[@media(hover:hover)_and_(pointer:fine)]:hover:border-secondary/50",
  "[@media(hover:hover)_and_(pointer:fine)]:hover:bg-surface-hover/60",
  "[@media(hover:hover)_and_(pointer:fine)]:hover:[transform:none]",
].join(" ");

/** Logo block: filter-only hover (no transform) for portfolio carousel. */
export const portfolioCaseLogo = [
  "transition-[filter]",
  "duration-200",
  easeOutStrong,
  "[@media(hover:hover)_and_(pointer:fine)]:group-hover:brightness-[0.96]",
  "motion-reduce:group-hover:brightness-100",
].join(" ");

export const caseLogo = [
  "transition-[transform,opacity]",
  "duration-200",
  easeOutStrong,
  "[@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-105",
  "[@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-90",
  "motion-reduce:group-hover:scale-100",
  "motion-reduce:group-hover:opacity-100",
].join(" ");

export const tagMoreBtn = [
  "transition-[transform,filter]",
  "duration-200",
  easeOutStrong,
  "[@media(hover:hover)_and_(pointer:fine)]:hover:scale-[1.02]",
  "active:scale-[0.97]",
  "motion-reduce:hover:scale-100",
  "motion-reduce:active:scale-100",
].join(" ");

export const homeHeroEnter = [
  "opacity-0",
  "animate-fade-in-up",
  "motion-reduce:opacity-100",
  "motion-reduce:animate-none",
].join(" ");

export const homeImageEnter = [
  "opacity-0",
  "animate-fade-in-scale",
  "motion-reduce:opacity-100",
  "motion-reduce:animate-none",
].join(" ");

export const homeBlogTabEnter = [
  "opacity-0",
  "animate-home-blog-tab-enter",
  "motion-reduce:opacity-100",
  "motion-reduce:animate-none",
].join(" ");

export const profileImage = [
  "transition-transform",
  "duration-200",
  easeOutStrong,
  "[@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-105",
  "motion-reduce:group-hover:scale-100",
].join(" ");

export const portfolioSlide = [
  "lg:opacity-0",
  "lg:animate-portfolio-fade-in",
  "motion-reduce:lg:opacity-100",
  "motion-reduce:lg:animate-none",
].join(" ");

/** Horizontal snap strip: hide scrollbars + momentum (replaces `.carousel` in global.css) */
export const carouselScrollChrome = [
  "[-ms-overflow-style:none]",
  "[scrollbar-width:none]",
  "[&::-webkit-scrollbar]:hidden",
  "[-webkit-overflow-scrolling:touch]",
].join(" ");

/**
 * Footer dock icons — stroke emphasis + fill dim (LinkedIn), only when `hover: hover` matches.
 * `group` must live on the parent `<li>`.
 */
export const footerIconWrapper = [
  "w-[1.5rem] h-[1.5rem] xs:w-[1.77rem] xs:h-[1.77rem]",
  "[@media(hover:hover)]:[&.active]:[&_svg_path]:stroke-2",
  "[@media(hover:hover)]:group-hover:[&_svg_path]:stroke-2",
  "[@media(hover:hover)]:group-focus-within:[&_svg_path]:stroke-2",
  "[@media(hover:hover)]:group-hover:[&_svg[fill]]:brightness-[0.85]",
  "[@media(hover:hover)]:group-focus-within:[&_svg[fill]]:brightness-[0.85]",
  "[@media(hover:hover)]:group-hover:[&_svg[fill]]:transition-[filter]",
  "[@media(hover:hover)]:group-hover:[&_svg[fill]]:duration-200",
  "[@media(hover:hover)]:group-hover:[&_svg[fill]]:ease-out",
  "[@media(hover:hover)]:group-focus-within:[&_svg[fill]]:transition-[filter]",
  "[@media(hover:hover)]:group-focus-within:[&_svg[fill]]:duration-200",
  "[@media(hover:hover)]:group-focus-within:[&_svg[fill]]:ease-out",
  "[@media(hover:hover)]:group-hover:[&_path[fill]]:brightness-[0.85]",
  "[@media(hover:hover)]:group-focus-within:[&_path[fill]]:brightness-[0.85]",
  "[@media(hover:hover)]:group-hover:[&_path[fill]]:transition-[filter]",
  "[@media(hover:hover)]:group-hover:[&_path[fill]]:duration-200",
  "[@media(hover:hover)]:group-hover:[&_path[fill]]:ease-out",
  "[@media(hover:hover)]:group-focus-within:[&_path[fill]]:transition-[filter]",
  "[@media(hover:hover)]:group-focus-within:[&_path[fill]]:duration-200",
  "[@media(hover:hover)]:group-focus-within:[&_path[fill]]:ease-out",
].join(" ");
