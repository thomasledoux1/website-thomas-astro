/**
 * Minimal line editor + command dispatcher for wterm (pattern inspired by
 * @wterm/just-bash BashShell).
 */

const BIRTH = new Date("1991-07-11");

function computeAge(): number {
  const now = new Date();
  let age = now.getFullYear() - BIRTH.getFullYear();
  const m = now.getMonth() - BIRTH.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < BIRTH.getDate())) age--;
  return age;
}

const COMMANDS_OUTPUT: Record<string, string> = {
  "/age": `You asked for age — I'm ${computeAge()} years old (born 11 Jul 1991).`,
  "/contact": [
    "Email (best): hello@thomasledoux.be",
    "Site:    https://www.thomasledoux.be",
    "I'm open to interesting side projects — say hi.",
  ].join("\r\n"),
  "/stack": [
    "Day-to-day: React, TypeScript, Next.js, and whatever ships the best UX.",
    "This site: Astro, Tailwind, and a touch of curiosity.",
  ].join("\r\n"),
  "/now": [
    "Frontend developer at Empathy Lab, based in Ghent, Belgium.",
    "Father of two, badminton player, campervan road trips when I can.",
  ].join("\r\n"),
  "/hobbies": ["Badminton", "Hiking", "Biking"].join("\r\n"),
  "/portfolio": [
    "Selected clients & projects (same list as the Portfolio page):",
    "",
    "  Woosh",
    "  Maat.Werk",
    "  Snackbar Martino",
    "  Borluut Joggers",
    "  Karaton",
    "  Rialto",
    "  Carlier Rekenen",
    "  Achter De Regenboog",
    "  DeckDeckGo",
    "  Psychotherapiepraktijk Kortrijk",
    "  thomasledoux.be (this site)",
    "",
    "https://www.thomasledoux.be/portfolio",
  ].join("\r\n"),
  "/help": [
    "Commands:",
    "  /age       — how old I am",
    "  /contact   — email & links",
    "  /stack     — tech I work with",
    "  /now       — what I'm up to",
    "  /hobbies   — how I spend time outside work",
    "  /portfolio — clients & projects",
    "  /theme     — site light/dark (see /theme help)",
    "  /help      — this list",
  ].join("\r\n"),
  "/theme help": [
    "Theme (same as the footer toggle):",
    "  /theme         — switch light ⟷ dark",
    "  /theme light   — light",
    "  /theme dark    — dark",
  ].join("\r\n"),
};

export type ThemeCommandAction = "toggle" | "light" | "dark";

type ResolveResult =
  | { type: "text"; text: string }
  | { type: "theme"; action: ThemeCommandAction };

function resolveCommand(line: string): ResolveResult {
  const trimmed = line.trim();
  const key = trimmed.toLowerCase();
  if (key === "") return { type: "text", text: "" };
  if (key === "/theme" || key === "/theme toggle") {
    return { type: "theme", action: "toggle" };
  }
  if (key === "/theme light") return { type: "theme", action: "light" };
  if (key === "/theme dark") return { type: "theme", action: "dark" };
  const out = COMMANDS_OUTPUT[key];
  if (out !== undefined) return { type: "text", text: out };
  return {
    type: "text",
    text: `Unknown command: ${trimmed}. Type /help for available commands.`,
  };
}

const PROMPT = "\x1b[1;32mthomas\x1b[0m:\x1b[1;34m~\x1b[0m$ ";

const GREETING = [
  "Thomas Ledoux — quick intro terminal",
  "Type /help to see what you can run.",
  "",
];

export class HomeIntroShell {
  private _write: ((data: string) => void) | null = null;
  private _onTheme: ((action: ThemeCommandAction) => string) | null = null;
  /** Called after each Enter (new prompt drawn); host can scroll viewport to bottom. */
  private _onAfterLine: (() => void) | null = null;
  private _line = "";
  private _cursor = 0;
  private _history: string[] = [];
  private _historyPos = -1;

  attach(
    write: (data: string) => void,
    onTheme?: (action: ThemeCommandAction) => string,
    onAfterLine?: () => void,
  ): void {
    this._write = write;
    this._onTheme = onTheme ?? null;
    this._onAfterLine = onAfterLine ?? null;
    write(GREETING.join("\r\n") + "\r\n");
    write(PROMPT);
  }

  handleInput(data: string): void {
    const write = this._write;
    if (!write) return;

    if (data === "\t") {
      return;
    }

    if (data === "\r") {
      const cur = this._line;
      this._line = "";
      this._cursor = 0;
      write("\r\n");

      const cmd = cur.trim();
      if (cmd) {
        this._history.push(cmd);
        this._historyPos = -1;
        const resolved = resolveCommand(cmd);
        let result: string;
        if (resolved.type === "theme") {
          result =
            this._onTheme?.(resolved.action) ??
            "Theme switching is unavailable here.";
        } else {
          result = resolved.text;
        }
        if (result) {
          write(result.replace(/\n/g, "\r\n"));
          write("\r\n");
        }
      }

      write(PROMPT);
      this._onAfterLine?.();
      return;
    }

    if (data === "\x7f" || data === "\b") {
      if (this._cursor > 0) {
        const tail = this._line.slice(this._cursor);
        this._line = this._line.slice(0, this._cursor - 1) + tail;
        this._cursor--;
        write("\b" + tail + "\x1b[K");
        if (tail.length > 0) write(`\x1b[${tail.length}D`);
      }
    } else if (data === "\x1b[A") {
      if (!this._history.length) return;
      if (this._historyPos < 0) this._historyPos = this._history.length;
      if (this._historyPos > 0) {
        this._historyPos--;
        const entry = this._history[this._historyPos];
        if (entry === undefined) return;
        write(`\r${PROMPT}\x1b[K${entry}`);
        this._line = entry;
        this._cursor = entry.length;
      }
    } else if (data === "\x1b[B") {
      if (this._historyPos < 0) return;
      this._historyPos++;
      if (this._historyPos >= this._history.length) {
        this._historyPos = -1;
        write(`\r${PROMPT}\x1b[K`);
        this._line = "";
        this._cursor = 0;
      } else {
        const entry = this._history[this._historyPos];
        if (entry === undefined) return;
        write(`\r${PROMPT}\x1b[K${entry}`);
        this._line = entry;
        this._cursor = entry.length;
      }
    } else if (data === "\x1b[D") {
      if (this._cursor > 0) {
        this._cursor--;
        write("\x1b[D");
      }
    } else if (data === "\x1b[C") {
      if (this._cursor < this._line.length) {
        this._cursor++;
        write("\x1b[C");
      }
    } else if (data === "\x15") {
      if (this._line.length > 0) {
        if (this._cursor > 0) write(`\x1b[${this._cursor}D`);
        write("\x1b[K");
        this._line = "";
        this._cursor = 0;
      }
    } else if (data === "\x01") {
      if (this._cursor > 0) {
        write(`\x1b[${this._cursor}D`);
        this._cursor = 0;
      }
    } else if (data === "\x05") {
      if (this._cursor < this._line.length) {
        write(`\x1b[${this._line.length - this._cursor}C`);
        this._cursor = this._line.length;
      }
    } else if (data === "\x03") {
      this._line = "";
      this._cursor = 0;
      write("^C\r\n");
      write(PROMPT);
      this._onAfterLine?.();
    } else if (data.length === 1 && data >= " ") {
      const tail = this._line.slice(this._cursor);
      this._line = this._line.slice(0, this._cursor) + data + tail;
      this._cursor++;
      if (tail.length === 0) {
        write(data);
      } else {
        write(data + tail + "\x1b[K");
        write(`\x1b[${tail.length}D`);
      }
    } else if (data.length > 1) {
      for (const ch of data) {
        this.handleInput(ch);
      }
    }
  }
}
