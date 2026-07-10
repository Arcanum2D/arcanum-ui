/** Context menu behavior — builds and shows an `.arc-context-menu` at (x, y),
 * clamped to the viewport. Closes on selection, outside pointerdown, Escape,
 * or when another menu opens. Returns a close function. */

export interface ArcContextMenuItem {
  label: string;
  danger?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
  /** Render a divider before this item */
  dividerBefore?: boolean;
}

let activeClose: (() => void) | null = null;

export function arcContextMenu(x: number, y: number, items: ArcContextMenuItem[]): () => void {
  activeClose?.();

  const menu = document.createElement('div');
  menu.className = 'arc-context-menu';
  menu.setAttribute('role', 'menu');

  const close = (): void => {
    menu.remove();
    document.removeEventListener('pointerdown', onOutside, true);
    document.removeEventListener('keydown', onKeydown, true);
    if (activeClose === close) activeClose = null;
  };

  const onOutside = (evt: PointerEvent): void => {
    if (!menu.contains(evt.target as Node)) close();
  };

  const onKeydown = (evt: KeyboardEvent): void => {
    if (evt.key === 'Escape') {
      evt.stopPropagation();
      close();
    }
  };

  for (const item of items) {
    if (item.dividerBefore) {
      const hr = document.createElement('hr');
      hr.className = 'arc-context-menu__divider';
      menu.appendChild(hr);
    }
    const btn = document.createElement('button');
    btn.className = item.danger ? 'arc-context-menu__item arc-context-menu__item--danger' : 'arc-context-menu__item';
    btn.setAttribute('role', 'menuitem');
    btn.textContent = item.label;
    btn.disabled = item.disabled ?? false;
    btn.addEventListener('click', () => {
      close();
      item.onSelect?.();
    });
    menu.appendChild(btn);
  }

  document.body.appendChild(menu);
  const { width, height } = menu.getBoundingClientRect();
  menu.style.left = `${Math.max(4, Math.min(x, window.innerWidth - width - 4))}px`;
  menu.style.top = `${Math.max(4, Math.min(y, window.innerHeight - height - 4))}px`;

  document.addEventListener('pointerdown', onOutside, true);
  document.addEventListener('keydown', onKeydown, true);
  activeClose = close;
  return close;
}
