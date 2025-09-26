import { effect } from './effect.js';
import { onCleanup } from './lifecycle.js';

/**
 * @param {(mount: (fn: () => import('./component.js').Component) => void) => void} fn
 */
export const when = (fn) => {
    effect(() => fn((factory) => {
        const c = factory();

        onCleanup(() => c.cleanup());
    }));
};