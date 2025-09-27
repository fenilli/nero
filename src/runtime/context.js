/**
 * @typedef {() => void} DestroyFn
 */

/**
 * @typedef {() => (void | DestroyFn)} InitFn
 */

/**
 * @typedef {Object} Context
 * @property {Array<Context>} _children
 * @property {Array<import('./effect.js').Effect>} _effects
 * @property {Array<Function>} _cleanups
 * @property {() => void} init
 * @property {() => void} destroy
 */

/**
 * @type {Array<Context>}
 */
const contextStack = [];

/**
 * @param {Context} context 
 */
export const pushContext = (context) => contextStack.push(context);
export const popContext = () => contextStack.pop();

/**
 * @type {() => Context | undefined}
 */
export const currentContext = () => contextStack[contextStack.length - 1];

/**
 * @param {InitFn} fn 
 */
export const context = (fn) => {
    /** @type {Context} */
    const context = {
        _children: [],
        _effects: [],
        _cleanups: [],
        init() {
            pushContext(context);
            const res = fn();
            if (typeof res === 'function') this._cleanups.push(res);
            popContext();
        },
        destroy() {
            for (const child of this._children) child.destroy();
            this._children = [];

            for (const effect of this._effects) effect.dispose();
            this._effects = [];

            for (const cleanup of this._cleanups) cleanup();
            this._cleanups = [];
        },
    };

    const parent = currentContext();
    if (parent) parent._children.push(context);

    return context;
};

/**
 * @param {Function} fn 
 */
export const onDestroy = (fn) => {
    const c = currentContext();
    if (!c) throw TypeError('onDestroy can be only added to an active context');

    c._cleanups.push(fn);
};