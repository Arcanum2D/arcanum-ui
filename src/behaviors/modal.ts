/** Modal behavior — overlay lifecycle, Escape handling and focus restore.
 * Markup stays in app code; pass the overlay element (`.arc-overlay`). */

export interface ArcModalOptions {
  /** Close when clicking the backdrop (default true) */
  closeOnBackdrop?: boolean;
  /** Close on Escape (default true) */
  closeOnEscape?: boolean;
  onClose?: () => void;
}

export interface ArcModalController {
  open(): void;
  close(): void;
  readonly isOpen: boolean;
}

export function arcModal(overlay: HTMLElement, options: ArcModalOptions = {}): ArcModalController {
  const { closeOnBackdrop = true, closeOnEscape = true, onClose } = options;
  let previousFocus: HTMLElement | null = null;
  let openState = false;

  const onKeydown = (evt: KeyboardEvent): void => {
    if (closeOnEscape && evt.key === 'Escape') {
      evt.stopPropagation();
      controller.close();
    }
  };

  const onBackdropClick = (evt: MouseEvent): void => {
    if (closeOnBackdrop && evt.target === overlay) {
      controller.close();
    }
  };

  const controller: ArcModalController = {
    get isOpen() {
      return openState;
    },
    open() {
      if (openState) return;
      openState = true;
      previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      overlay.classList.remove('is-closing');
      overlay.style.display = 'flex';
      document.addEventListener('keydown', onKeydown, true);
      overlay.addEventListener('click', onBackdropClick);
      const focusable = overlay.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      focusable?.focus();
    },
    close() {
      if (!openState) return;
      openState = false;
      document.removeEventListener('keydown', onKeydown, true);
      overlay.removeEventListener('click', onBackdropClick);
      overlay.classList.add('is-closing');
      overlay.addEventListener(
        'animationend',
        () => {
          if (!openState) {
            overlay.style.display = 'none';
            overlay.classList.remove('is-closing');
          }
        },
        { once: true },
      );
      previousFocus?.focus();
      onClose?.();
    },
  };

  overlay.style.display = 'none';
  return controller;
}
