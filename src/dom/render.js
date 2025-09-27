import { context } from '../runtime/index.js';

/**
 * @typedef {(anchor: Element, props: Record<any, any>) => void} RenderFn
 */

/**
 * @param {RenderFn} fn 
 * @param {Element} anchor 
 */
export const render = (fn, anchor, props = {}) => {
    const c = context(() => fn(anchor, props));
    c.init();

    return c;
};