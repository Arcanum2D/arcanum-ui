/** Tabs behavior — wires a `.arc-tabs` strip to its panels.
 * Each `.arc-tab` button declares its panel with `data-arc-tab="#panel-id"`.
 * Panels other than the active one get the `hidden` attribute. */

export interface ArcTabsOptions {
  onChange?: (panelSelector: string) => void;
}

export interface ArcTabsController {
  /** Programmatically activate a tab by its panel selector */
  select(panelSelector: string): void;
  destroy(): void;
}

export function arcTabs(tablist: HTMLElement, options: ArcTabsOptions = {}): ArcTabsController {
  const tabs = Array.from(tablist.querySelectorAll<HTMLElement>('.arc-tab'));
  tablist.setAttribute('role', 'tablist');

  const panelOf = (tab: HTMLElement): HTMLElement | null => {
    const sel = tab.getAttribute('data-arc-tab');
    return sel ? document.querySelector<HTMLElement>(sel) : null;
  };

  const activate = (tab: HTMLElement): void => {
    for (const t of tabs) {
      const active = t === tab;
      t.classList.toggle('is-active', active);
      t.setAttribute('aria-selected', String(active));
      t.tabIndex = active ? 0 : -1;
      const panel = panelOf(t);
      if (panel) panel.hidden = !active;
    }
    options.onChange?.(tab.getAttribute('data-arc-tab') ?? '');
  };

  const onClick = (evt: MouseEvent): void => {
    const tab = (evt.target as HTMLElement).closest<HTMLElement>('.arc-tab');
    if (tab && tabs.includes(tab)) activate(tab);
  };

  const onKeydown = (evt: KeyboardEvent): void => {
    if (evt.key !== 'ArrowLeft' && evt.key !== 'ArrowRight') return;
    const current = tabs.findIndex((t) => t.classList.contains('is-active'));
    if (current === -1) return;
    const next = tabs[(current + (evt.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
    activate(next);
    next.focus();
    evt.preventDefault();
  };

  tablist.addEventListener('click', onClick);
  tablist.addEventListener('keydown', onKeydown);

  for (const t of tabs) t.setAttribute('role', 'tab');
  const initial = tabs.find((t) => t.classList.contains('is-active')) ?? tabs[0];
  if (initial) activate(initial);

  return {
    select(panelSelector) {
      const tab = tabs.find((t) => t.getAttribute('data-arc-tab') === panelSelector);
      if (tab) activate(tab);
    },
    destroy() {
      tablist.removeEventListener('click', onClick);
      tablist.removeEventListener('keydown', onKeydown);
    },
  };
}
