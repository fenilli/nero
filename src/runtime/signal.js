import { currentEffect } from './effect.js';

/**
 * @template T
 * @typedef {() => T} ReadableSignal
 */

/**
 * @template T
 * @typedef {(next: T | ((prev: T) => T)) => void} WritableSignal
 */

/**
 * @template T
 * @typedef {[ReadableSignal<T>, WritableSignal<T>]} Signal
 */

let pending = /** @type {Set<import('./effect.js').Effect>} */ (new Set());
let scheduled = false;

/**
 * @param {import('./effect.js').Effect} effect
 */
const schedule = (effect) => {
    pending.add(effect);
    if (scheduled) return;

    scheduled = true;
    queueMicrotask(() => {
        scheduled = false;
        for (const effect of [...pending]) effect.run();
        pending.clear();
    });
};

/**
 * @template T
 * @param {T} initial 
 * @returns {Signal<T>}
 */
export const signal = (initial) => {
    let value = initial;
    const subscribers = new Set();

    /** @type {ReadableSignal<T>} */
    function read() {
        const effect = currentEffect();
        if (effect) {
            subscribers.add(effect);
            effect._deps.push(subscribers);
        }

        return value;
    }

    /** @type {WritableSignal<T>} */
    function write(next) {
        const v = typeof next === 'function' ? next(value) : next;
        if (v === value) return;
        value = v;
        for (const effect of [...subscribers]) schedule(effect);
    }

    return [read, write];
}