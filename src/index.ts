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
