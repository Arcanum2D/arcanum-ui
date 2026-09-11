export { arcToast } from './behaviors/toast.js';
export type { ArcToastOptions, ArcToastVariant } from './behaviors/toast.js';
export { arcModal } from './behaviors/modal.js';
export type { ArcModalOptions, ArcModalController } from './behaviors/modal.js';
export { arcTabs } from './behaviors/tabs.js';
export type { ArcTabsOptions, ArcTabsController } from './behaviors/tabs.js';
export { arcTooltip } from './behaviors/tooltip.js';
export type { ArcTooltipOptions } from './behaviors/tooltip.js';
export { arcContextMenu } from './behaviors/context-menu.js';
export type { ArcContextMenuItem } from './behaviors/context-menu.js';

export type ArcFontPreset = 'jersey' | 'arcade' | 'clean';

/** Apply a player-selected font preset (persist the choice yourself). */
export function setArcFont(preset: ArcFontPreset): void {
  document.documentElement.setAttribute('data-arc-font', preset);
}

export type ArcA11yScale = 'normal' | 'large' | 'xlarge';

export const ARC_A11Y_SCALES: readonly ArcA11yScale[] = ['normal', 'large', 'xlarge'];

/**
 * Apply a player-selected accessibility font scale (persist the choice
 * yourself). Independent of setArcFont — this multiplies --arc-font-scale
 * on top of the per-font metric correction, it does not replace it.
 * Passing 'normal' (or omitting the call) leaves --arc-fs-* unchanged.
 */
export function setArcA11yScale(scale: ArcA11yScale): void {
  document.documentElement.setAttribute('data-arc-a11y-scale', scale);
}
