import { effect, onCleanup } from './reactive.js';

/**
 * @param {Element} element
 * @param {Element} anchor
 * @returns {Element}
 */
export const mount = (element, anchor) => {
    if (anchor.nodeType === Node.COMMENT_NODE) anchor.parentNode.insertBefore(element, anchor);
    else anchor.appendChild(element);

    return element;
};

/**
 * @param {() => Element} fn
 * @param {Element} anchor
 */
export const render = (fn, anchor) => {
    effect(() => {
        const root = mount(fn(), anchor);
        onCleanup(() => root.remove());
    });
};

/**
 * @param {Element} anchor
 * @param {(mount: () => Element) => Element | void} fn
 */
export const If = (anchor, fn) => {
    effect(() => {
        let el = null;

        /**
         * @param {() => Element} element
        */
        const rootFn = (fn) => {
            el = mount(fn(), anchor);
        };

        fn(rootFn);

        onCleanup(() => {
            if (el) {
                el.remove();
                el = null;
            }
        });
    });
};