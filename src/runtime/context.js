/** @typedef {import('./reactive.js').Effect} Effect */
/** @typedef {import('./component.js').Component} Component */

/** @type {Array<Effect>} */
const effectStack = [];

/** @type {Array<Component>} */
const componentStack = [];

/**
 * @template T
 * @param {Effect} effect
 * @param {() => T} fn
 * @returns {T}
 */
export const scopeEffect = (effect, fn) => {
    effectStack.push(effect);
    const ret = fn();
    effectStack.pop();

    return ret;
};

/**
 * @template T
 * @param {Component} component
 * @param {() => T} fn
 * @returns {T}
 */
export const scopeComponent = (component, fn) => {
    componentStack.push(component);
    const ret = fn();
    componentStack.pop();

    return ret;
};

/**
 * @returns {Effect | undefined}
 */
export const currentEffect = () => {
    return effectStack[effectStack.length - 1];
};

/**
 * @returns {Component | undefined}
 */
export const currentComponent = () => {
    return componentStack[componentStack.length - 1];
};