import { CopyButton, CopyButtonArgs } from "./Copybutton";
import { ShikiLine } from "./ShikiLine";
import {
  InlineMarkingDefinition,
  LineMarkingDefinition,
  MarkerTypeOrder,
} from "./types";

export class ShikiBlock {
  private htmlBeforeFirstLine: string | undefined = "";
  private shikiLines: ShikiLine[] = [];
  private htmlAfterLastLine: string | undefined = "";
  private copyButton: CopyButton | null = null;

  constructor(highlightedCodeHtml: string, copyButtonArgs: CopyButtonArgs) {
    if (!highlightedCodeHtml) return;

    const codeBlockRegExp =
      /^\s*(<pre.*?><code.*?>)([\s\S]*)(<\/code><\/pre>)\s*$/;
    const matches = highlightedCodeHtml.match(codeBlockRegExp);
    if (!matches)
      throw new Error(
        `Shiki-highlighted code block HTML did not match expected format. HTML code:\n${highlightedCodeHtml}`,
      );

    this.htmlBeforeFirstLine = matches[1];
    const innerHtml = matches[2];
    this.htmlAfterLastLine = matches[3];

    // Parse inner HTML code to ShikiLine instances
    const innerHtmlLines = innerHtml?.split(/\r?\n/);
    this.shikiLines =
      innerHtmlLines?.map((htmlLine) => new ShikiLine(htmlLine)) ?? [];

    this.copyButton = new CopyButton(this.shikiLines, copyButtonArgs);
  }

  applyMarkings(
    lineMarkings: LineMarkingDefinition[],
    inlineMarkings: InlineMarkingDefinition[],
  ) {
    if (!lineMarkings.length && !inlineMarkings.length) return;

    this.shikiLines.forEach((line, i) => {
      // Determine line marker type (if any)
      const matchingDefinitions = lineMarkings.filter((def) =>
        def.lines.includes(i + 1),
      );
      if (matchingDefinitions) {
        const markerTypes = matchingDefinitions.map((def) => def.markerType);
        markerTypes.sort(
          (a, b) => MarkerTypeOrder.indexOf(a) - MarkerTypeOrder.indexOf(b),
        );
        const highestPrioMarkerType = markerTypes[0];
        line.setLineMarkerType(highestPrioMarkerType);
      }

      line.applyInlineMarkings(inlineMarkings);
    });
  }

  renderToHtml() {
    const linesHtml = this.shikiLines
      .map((line) => {
        line.ensureTokenColorContrast();
        return line.renderToHtml();
      })
      .join("\n");
    const copyButton = this.copyButton?.renderToHtml();
    return `${this.htmlBeforeFirstLine}${linesHtml}${this.htmlAfterLastLine}${copyButton}`;
  }
}
