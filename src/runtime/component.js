import { Context, currentContext } from './context.js';

const COMPONENT = 1;

export class Component extends Context {
    constructor(fn) {
        super(COMPONENT, fn);
    }
}

/**
 * @param {Function} fn 
 * @returns {Component} 
 */
export const component = (fn) => {
    const component = new Component(fn);
    component.execute();
    return component;
};

/**
 * @returns {Component | undefined}
 */
export const currentComponent = () => {
    const ctx = /** @type {Component} */ (currentContext());
    return ctx && ctx._type === COMPONENT ? ctx : undefined;
};