import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Terminal, useTerminal } from "@wterm/react";
import type { WTerm } from "@wterm/dom";
import "@wterm/react/css";
import {
  HomeIntroShell,
  type ThemeCommandAction,
} from "../lib/home-terminal-shell";
import { applySiteTheme, getSiteTheme } from "../lib/site-theme";

/** wterm renders a fixed grid; “wrapping” on narrow viewports = fewer columns. */
const FALLBACK_CH = 8.4;
const MIN_COLS = 20;
const MAX_COLS = 120;

function measureCharWidth(termElement: HTMLElement): number | null {
  const grid = termElement.querySelector(".term-grid");
  if (!grid) return null;
  const probe = document.createElement("span");
  probe.className = "term-cell";
  probe.textContent = "M";
  probe.style.cssText = "position:absolute;visibility:hidden;";
  grid.appendChild(probe);
  const w = probe.getBoundingClientRect().width;
  probe.remove();
  return w > 0 ? w : null;
}

function horizontalInset(termElement: HTMLElement): number {
  const cs = getComputedStyle(termElement);
  const pl = parseFloat(cs.paddingLeft) || 0;
  const pr = parseFloat(cs.paddingRight) || 0;
  const bl = parseFloat(cs.borderLeftWidth) || 0;
  const br = parseFloat(cs.borderRightWidth) || 0;
  return pl + pr + bl + br;
}

function computeCols(
  containerWidthPx: number,
  charWidthPx: number,
  termInsetPx: number,
): number {
  const inner = Math.max(0, containerWidthPx - termInsetPx);
  const c = Math.floor(inner / charWidthPx);
  return Math.max(MIN_COLS, Math.min(MAX_COLS, c));
}

function runThemeCommand(action: ThemeCommandAction): string {
  if (action === "toggle") {
    const next = getSiteTheme() === "dark" ? "light" : "dark";
    applySiteTheme(next);
  } else {
    applySiteTheme(action);
  }
  return `Site theme: ${getSiteTheme()} (saved for your next visit).`;
}

export default function HomeTerminal() {
  const { ref, write } = useTerminal();
  const shellRef = useRef<HomeIntroShell | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const charWidthRef = useRef(FALLBACK_CH);
  const termInsetRef = useRef(28);

  const [cols, setCols] = useState(80);

  const recomputeCols = useCallback(() => {
    const box = containerRef.current;
    if (!box) return;
    const w = box.getBoundingClientRect().width;
    const next = computeCols(w, charWidthRef.current, termInsetRef.current);
    setCols((c) => (c !== next ? next : c));
  }, []);

  useLayoutEffect(() => {
    const box = containerRef.current;
    if (!box) return;
    const ro = new ResizeObserver(() => {
      recomputeCols();
    });
    ro.observe(box);
    recomputeCols();
    return () => ro.disconnect();
  }, [recomputeCols]);

  const handleReady = useCallback(
    (wt: WTerm) => {
      /** Run after wterm’s rAF render so scrollHeight is up to date (mobile + long output). */
      const scrollToBottomAfterRender = () => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            const el = wt.element;
            el.scrollTop = el.scrollHeight;
          });
        });
      };

      if (!shellRef.current) {
        const shell = new HomeIntroShell();
        shellRef.current = shell;
        shell.attach(write, runThemeCommand, scrollToBottomAfterRender);
      }
      const cw = measureCharWidth(wt.element);
      if (cw) charWidthRef.current = cw;
      termInsetRef.current = horizontalInset(wt.element);
      recomputeCols();
    },
    [write, recomputeCols],
  );

  const handleData = useCallback((data: string) => {
    shellRef.current?.handleInput(data);
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full max-w-full shrink-0 overflow-hidden rounded-xl border border-border-strong bg-[oklch(0.16_0.02_155)] shadow-card"
    >
      <Terminal
        ref={ref}
        theme="solarized-dark"
        autoResize={false}
        cursorBlink
        className="home-terminal wterm w-full"
        cols={cols}
        rows={14}
        onData={handleData}
        onReady={handleReady}
      />
    </div>
  );
}
