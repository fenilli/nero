import { scopeComponent, currentComponent } from "./context.js";

/**
 * @typedef {Object} Component
 * @property {Component} parent
 * @property {Set<children>} children
 * @property {Set<Effect>} effects
 * @property {Function[]} mountQueue
 * @property {Function[]} unmountQueue
 * @property {Node | undefined} root
 */

/**
 * @param {() => Node} fn
 * @returns {Component}
 */
export const component = (fn) => {
    /** @type {Component} */
    const _component = {
        parent: currentComponent(),
        children: new Set(),
        effects: new Set(),
        mountQueue: [],
        unmountQueue: [],
    };

    if (_component.parent) _component.parent.children.add(_component);

    _component.root = scopeComponent(_component, fn);

    return _component;
};

/**
 * @param {Function} fn
 */
export function onMount(fn) {
    const component = currentComponent();
    if (!component) throw TypeError("onMount can only be called inside a component");

    component.mountQueue.push(fn);
}

/**
 * @param {Function} fn
 */
export function onUnmount(fn) {
    const component = currentComponent();
    if (!component) throw TypeError("onUnmount can only be called inside a component");

    component.unmountQueue.push(fn);
};