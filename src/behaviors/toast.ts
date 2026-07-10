/** Toast behavior — the only JS a toast needs. CSS classes are public, so
 * apps may also render their own markup and skip this helper entirely. */

export type ArcToastVariant = 'success' | 'danger' | 'warning' | 'info' | 'gold';

export interface ArcToastOptions {
  message: string;
  variant?: ArcToastVariant;
  /** ms before auto-dismiss; 0 disables */
  duration?: number;
  position?: 'top' | 'bottom';
}

function getContainer(position: 'top' | 'bottom'): HTMLElement {
  const id = `arc-toast-container-${position}`;
  let container = document.getElementById(id);
  if (!container) {
    container = document.createElement('div');
    container.id = id;
    container.className =
      position === 'bottom' ? 'arc-toast-container arc-toast-container--bottom' : 'arc-toast-container';
    document.body.appendChild(container);
  }
  return container;
}

/** Show a toast. Returns a function that dismisses it early. */
export function arcToast(options: ArcToastOptions): () => void {
  const { message, variant, duration = 4000, position = 'top' } = options;

  const toast = document.createElement('div');
  toast.className = variant ? `arc-toast arc-toast--${variant}` : 'arc-toast';
  toast.setAttribute('role', 'status');
  toast.textContent = message;

  getContainer(position).appendChild(toast);

  let dismissed = false;
  const dismiss = (): void => {
    if (dismissed) return;
    dismissed = true;
    toast.classList.add('is-closing');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  };

  toast.addEventListener('click', dismiss);
  if (duration > 0) {
    setTimeout(dismiss, duration);
  }
  return dismiss;
}
