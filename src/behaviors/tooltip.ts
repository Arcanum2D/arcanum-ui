/** Tooltip behavior — lifecycle + cursor-follow positioning for `.arc-tooltip`.
 * One shared tooltip element is lazily created and reused (a page never shows
 * two tooltips at once). Content is per-target: string (HTML), element, or a
 * lazy factory re-evaluated on every show (ideal for live game data). */

export interface ArcTooltipOptions {
  content: string | HTMLElement | (() => string | HTMLElement);
  /** Extra class(es) appended to `.arc-tooltip` */
  className?: string;
  /** Distance from the cursor in px (default 14) */
  offset?: number;
}

let tipEl: HTMLDivElement | null = null;

function ensureTip(): HTMLDivElement {
  if (!tipEl) {
    tipEl = document.createElement('div');
    tipEl.style.display = 'none';
    tipEl.setAttribute('role', 'tooltip');
    document.body.appendChild(tipEl);
  }
  return tipEl;
}

function place(tip: HTMLDivElement, x: number, y: number, offset: number): void {
  const { width, height } = tip.getBoundingClientRect();
  let left = x + offset;
  let top = y + offset;
  if (left + width > window.innerWidth - 4) left = x - width - offset;
  if (top + height > window.innerHeight - 4) top = y - height - offset;
  tip.style.left = `${Math.max(4, left)}px`;
  tip.style.top = `${Math.max(4, top)}px`;
}

/** Attach a tooltip to `target`. Returns a detach function. */
export function arcTooltip(target: HTMLElement, options: ArcTooltipOptions): () => void {
  const offset = options.offset ?? 14;

  const show = (): void => {
    const tip = ensureTip();
    tip.className = options.className ? `arc-tooltip ${options.className}` : 'arc-tooltip';
    const content = typeof options.content === 'function' ? options.content() : options.content;
    if (typeof content === 'string') tip.innerHTML = content;
    else tip.replaceChildren(content);
    tip.style.display = 'block';
  };

  const onMouseEnter = (evt: MouseEvent): void => {
    show();
    place(ensureTip(), evt.clientX, evt.clientY, offset);
  };

  const onMouseMove = (evt: MouseEvent): void => {
    place(ensureTip(), evt.clientX, evt.clientY, offset);
  };

  const hide = (): void => {
    if (tipEl) tipEl.style.display = 'none';
  };

  // keyboard focus: anchor below the element instead of the cursor
  const onFocus = (): void => {
    show();
    const rect = target.getBoundingClientRect();
    place(ensureTip(), rect.left, rect.bottom, 6);
  };

  target.addEventListener('mouseenter', onMouseEnter);
  target.addEventListener('mousemove', onMouseMove);
  target.addEventListener('mouseleave', hide);
  target.addEventListener('focus', onFocus);
  target.addEventListener('blur', hide);

  return () => {
    hide();
    target.removeEventListener('mouseenter', onMouseEnter);
    target.removeEventListener('mousemove', onMouseMove);
    target.removeEventListener('mouseleave', hide);
    target.removeEventListener('focus', onFocus);
    target.removeEventListener('blur', hide);
  };
}
