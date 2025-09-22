import { scopeEffect, currentEffect, currentComponent } from './context.js';

/**
 * @typedef {Object} Effect
 * @property {Set<Set<Effect>>} deps
 * @property {Set<Function>} cleanups
 * @property {Function} execute
 */

/** @type {Set<Effect>} */
let pendingEffects = new Set();

/** @type {boolean} */
let scheduled = false;

/**
 * @param {Effect} effect
*/
const schedule = (effect) => {
    pendingEffects.add(effect);
    if (scheduled) return;

    scheduled = true;
    queueMicrotask(() => {
        scheduled = false;
        for (const effect of [...pendingEffects]) effect.execute();
        pendingEffects.clear();
    });
};

/**
 * @template T
 * @param {T} initial
 * @returns {[() => T, (next: T) => void]}
 */
export const signal = (initial) => {
    let value = initial;
    /** @type {Set<Effect>} */
    const subscribers = new Set();

    function read() {
        const effect = currentEffect();

        if (effect) {
            subscribers.add(effect);
            effect.deps.add(subscribers);
        }

        return value;
    }

    function write(next) {
        if (value === next) return;

        value = next;
        for (const effect of [...subscribers]) schedule(effect);
    }

    return [read, write];
};

/**
 * @param {Function} fn
 */
export const effect = (fn) => {
    /** @type {Effect} */
    const effect = {
        deps: new Set(),
        cleanups: new Set(),
        execute() {
            for (const clp of effect.cleanups) clp();
            effect.cleanups.clear();

            for (const dep of effect.deps) dep.delete(effect);
            effect.deps.clear();

            const clp = scopeEffect(effect, fn);
            if (typeof clp === 'function') effect.cleanups.add(clp);
        }
    };

    effect.execute();

    const component = currentComponent();
    if (component) component.effects.add(effect);
};