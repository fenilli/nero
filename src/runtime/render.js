/** @typedef {import('./component.js').Component} Component */

/**
 * @param {Component} component 
 */
const unmountChildren = (component) => {
    for (const child of component.children) unmountChildren(child);
    component.children.clear();

    for (const effect of component.effects) {
        for (const clp of effect.cleanups) clp();
        effect.cleanups.clear();

        for (const dep of effect.deps) dep.delete(effect);
        effect.deps.clear();
    }
    component.effects.clear();

    for (const umq of component.unmountQueue) umq();
    component.unmountQueue = [];
};

/**
 * @param {Component} component
 * @param {Node} anchor
 */
export const mount = (component, anchor) => {
    anchor.appendChild(component.root);

    for (const mq of component.mountQueue) {
        const clp = mq();
        if (typeof clp === 'function') component.unmountQueue.push(clp);
    }

    component.mountQueue = [];
};

/**
 * @param {Component} component
 */
export const unmount = (component) => {
    if (component.root && component.root.parentNode) component.root.parentNode.removeChild(component.root);
    unmountChildren(component);
};