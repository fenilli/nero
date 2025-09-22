/**
 * @typedef {Object} Effect
 * @property {Effect} __parent,
 * @property {Set<Effect>} __children,
 * @property {Set<Set<Effect>>} __deps
 * @property {Set<Function>} __cleanups
 * @property {() => void} execute
*/

/** @type {Array<Effect>} */
const effectStack = [];

/** @type {Set<Effect>} */
let pendingEffects = new Set();

/** @type {boolean} */
let scheduled = false;

/**
 * @returns {Effect | undefined}
 */
export const currentEffect = () => {
    return effectStack[effectStack.length - 1];
};

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
 * @param {Effect} effect 
 */
const cleanupEffect = (effect) => {
    for (const child of effect.__children) cleanupEffect(child);
    effect.__children.clear();

    for (const dep of effect.__deps) dep.delete(effect);
    effect.__deps.clear();

    for (const clp of effect.__cleanups) clp();
    effect.__cleanups.clear();
}

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
            effect.__deps.add(subscribers);
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
        __parent: currentEffect(),
        __children: new Set(),
        __deps: new Set(),
        __cleanups: new Set(),
        execute() {
            cleanupEffect(effect);

            effectStack.push(effect);
            const clp = fn();
            if (typeof clp === 'function') this.__cleanups.add(clp);
            effectStack.pop();
        }
    };

    if (effect.__parent) effect.__parent.__children.add(effect);
    effect.execute();
};

/**
 * @param {Function} fn 
 */
export const onCleanup = (fn) => {
    const effect = currentEffect();
    if (!effect) throw TypeError('The lifecycle onCleanup must be called inside an effect');
    effect.__cleanups.add(fn);
};