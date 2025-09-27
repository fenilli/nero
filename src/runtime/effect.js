import { currentContext } from './context.js';

/**
 * @typedef {() => void} DisposeFn
 */

/**
 * @typedef {() => (void | DisposeFn)} RunFn
 */

/**
 * @typedef {Object} Effect
 * @property {Array<Set<Effect>>} _deps
 * @property {Array<Function>} _cleanups
 * @property {() => void} run
 * @property {() => void} dispose
 */

/**
 * @type {Array<Effect>}
 */
const effectStack = [];

/**
 * @param {Effect} effect 
 */
export const pushEffect = (effect) => effectStack.push(effect);
export const popEffect = () => effectStack.pop();

/**
 * @type {() => Effect | undefined}
 */
export const currentEffect = () => effectStack[effectStack.length - 1];

/**
 * @param {RunFn} fn
 */
export const effect = (fn) => {
    /** @type {Effect} */
    const effect = {
        _deps: [],
        _cleanups: [],
        run() {
            this.dispose();

            pushEffect(effect);
            const res = fn();
            if (typeof res === 'function') this._cleanups.push(res);
            popEffect();
        },
        dispose() {
            for (const dep of this._deps) dep.delete(this);
            this._deps = [];

            for (const cleanup of this._cleanups) cleanup();
            this._cleanups = [];
        },
    };

    effect.run();

    const context = currentContext();
    if (context) context._effects.push(effect);

    return effect;
};

/**
 * @param {Function} fn 
 */
export const onDispose = (fn) => {
    const e = currentEffect();
    if (!e) throw TypeError('onDispose can be only added to an active effect');

    e._cleanups.push(fn);
};