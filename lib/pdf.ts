import { jsPDF } from 'jspdf';

/**
 * Minimal, dependency-free HTML -> PDF renderer tuned for the chapter-solution
 * HTML used across the SolveNCERT book pages. Produces human-readable PDFs with
 * proper headings, spacing and lists instead of a single unformatted paragraph.
 *
 * Supported tags: h1, h2, h3, p, div, span, strong, b, br, ol, ul, li,
 * blockquote. Everything else is stripped and its text kept.
 */

type State = {
  doc: jsPDF;
  y: number;
  inList: boolean;
  listIndex: number;
  pageBreakAt: number;
  margin: number;
  width: number;
};

function resetFont(state: State, size: number, bold = false, italic = false) {
  const doc = state.doc;
  doc.setFont('helvetica', bold ? 'bold' : italic ? 'italic' : 'normal');
  doc.setFontSize(size);
  doc.setTextColor(30, 30, 30);
}

function writeText(state: State, text: string, opts: { size?: number; bold?: boolean; italic?: boolean; indent?: number; spacingBefore?: number } = {}) {
  const { size = 10, bold = false, italic = false, indent = 0, spacingBefore = 0 } = opts;
  const doc = state.doc;
  const clean = text.replace(/\s+/g, ' ').trim();
  if (!clean) return;

  state.y += spacingBefore;
  ensurePage(state, 40);
  resetFont(state, size, bold, italic);

  const x = state.margin + indent;
  const maxWidth = state.width - indent - state.margin;
  const lines = doc.splitTextToSize(clean, maxWidth) as string[];
  for (const line of lines) {
    ensurePage(state, 40);
    doc.text(line, x, state.y);
    state.y += size * 1.5;
  }
}

function ensurePage(state: State, reserve = 0) {
  if (state.y > state.pageBreakAt - reserve) {
    state.doc.addPage();
    state.y = state.margin;
  }
}

function renderList(state: State, items: string[], ordered: boolean) {
  ensurePage(state, 40);
  items.forEach((item, i) => {
    const marker = ordered ? `${i + 1}.` : '\u2022';
    writeText(state, item, { size: 10, indent: 12, spacingBefore: 2 });
    state.y -= (10 * 1.5); // back up so marker can sit on the same spot
    resetFont(state, 10, true);
    state.doc.text(marker, state.margin + 4, state.y);
    state.y += (10 * 1.5);
  });
}

/**
 * Convert a solution HTML string into a formatted PDF.
 * @param html the HTML document/body fragment
 * @param filename resulting file name
 */
export function htmlToPdf(html: string, filename: string) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const state: State = {
    doc,
    y: 48,
    inList: false,
    listIndex: 0,
    pageBreakAt: 790,
    margin: 48,
    width: 595,
  };

  // Strip the <style> block and <head>/<title> so only body content remains.
  const body = html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<head[\s\S]*?<\/head>/gi, '')
    .replace(/<title[\s\S]*?<\/title>/gi, '')
    .replace(/<\/?html>/gi, '')
    .replace(/<\/?body>/gi, '');

  // Tokenize into block-level segments, preserving nesting for lists.
  const blockRe = /<(h1|h2|h3|p|div|ol|ul|li|br|blockquote)(\s[^>]*)?>|<\/(h1|h2|h3|p|div|ol|ul|li|blockquote)>/gi;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  const listStack: { ordered: boolean; items: string[] }[] = [];

  const pushTextUntil = (endIdx: number) => {
    const raw = body.slice(lastIndex, endIdx);
    lastIndex = endIdx;
    const text = raw
      .replace(/<[^>]+>/g, '')   // remove any inline tags
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
    if (!text.trim()) return;

    if (listStack.length) {
      // In a list <li> — accumulate item text.
      const top = listStack[listStack.length - 1];
      // Only start a new item on <li>, handled by main loop; here append text.
      if (!state.inList) {
        top.items.push(text.trim());
        state.inList = true;
      } else {
        top.items[top.items.length - 1] += ' ' + text.trim();
      }
      return;
    }
    // Outside lists: emit as a plain paragraph (default size).
    writeText(state, text, { size: 10 });
  };

  while ((match = blockRe.exec(body)) !== null) {
    const [full, openTag, , closeTag] = match;
    const isOpen = !!openTag;
    const tag = (openTag || closeTag).toLowerCase();

    pushTextUntil(match.index);

    if (isOpen) {
      switch (tag) {
        case 'h1':
          ensurePage(state, 60);
          state.y += 12;
          resetFont(state, 18, true);
          break;
        case 'h2':
          ensurePage(state, 60);
          state.y += 16;
          resetFont(state, 13, true);
          break;
        case 'h3':
          ensurePage(state, 50);
          state.y += 12;
          resetFont(state, 11, true);
          break;
        case 'ol':
        case 'ul':
          listStack.push({ ordered: tag === 'ol', items: [] });
          state.inList = false;
          break;
        case 'li':
          break;
        case 'br':
          state.y += 12;
          break;
        case 'p':
        case 'div':
          state.y += 4;
          break;
      }
    } else {
      switch (tag) {
        case 'h1':
          state.y += 14;
          resetFont(state, 10);
          break;
        case 'h2':
          state.y += 10;
          resetFont(state, 10);
          break;
        case 'h3':
          state.y += 8;
          resetFont(state, 10);
          break;
        case 'ol':
        case 'ul': {
          const top = listStack.pop();
          state.inList = false;
          if (top && top.items.length) {
            renderList(state, top.items, top.ordered);
          }
          break;
        }
        case 'li':
          break;
        case 'p':
        case 'div':
          state.y += 6;
          break;
      }
    }
  }
  pushTextUntil(body.length);

  // Footer
  ensurePage(state, 40);
  resetFont(state, 9, false, true);
  doc.setTextColor(120, 120, 120);
  doc.text('SolveNCERT — Powered by NOVEXA | solvencert · NCERT 2026 Revised Syllabus', state.margin, 815);

  doc.save(filename);
}
