/**
 * @typedef {Object} Effect
 * @property {Set<Set<Effect>>} deps
 * @property {Set<Function>} cleanups
 * @property {Function} execute
 */

/**
 * @typedef {Object} Component
 * @property {Component} parent
 * @property {Set<children>} children
 * @property {Set<Effect>} effects
 * @property {Function[]} mountQueue
 * @property {Function[]} unmountQueue
 * @property {Node | null} root
 */

/** @type {Array<Effect>} */
const effectStack = [];

/** @type {Array<Component>} */
const componentStack = [];

/**
 * @returns {Effect | undefined}
 */
const currentEffect = () => {
    return effectStack[effectStack.length - 1];
};

/**
 * @param {Effect} effect
 */
const startEffectScope = (effect) => {
    effectStack.push(effect);
};

/**
 * @param {Component} component
 * @param {Function} fn
 */
const endEffectScope = () => {
    effectStack.pop();
};

/**
 * @returns {Component | undefined}
 */
const currentComponent = () => {
    return componentStack[componentStack.length - 1];
};

/**
 * @param {Component} component
 */
const startComponentScope = (component) => {
    componentStack.push(component);
};

/**
 * @param {Component} component
 * @param {Function} fn
 */
const endComponentScope = () => {
    componentStack.pop();
};

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
 * @type {Effect} effect
 */
const cleanupEffect = (effect) => {
    for (const clp of effect.cleanups) clp();
    effect.cleanups.clear();

    for (const dep of effect.deps) dep.delete(effect);
    effect.deps.clear();
}

/**
 * @param {Function} fn
 */
export const effect = (fn) => {
    /** @type {Effect} */
    const effect = {
        deps: new Set(),
        cleanups: new Set(),
        execute() {
            cleanupEffect(effect);

            startEffectScope(effect);
            fn();
            endEffectScope();
        }
    };

    effect.execute();

    const component = currentComponent();
    if (component) component.effects.add(effect);
};

/**
 * @param {Function} fn
 */
export function onCleanup(fn) {
    const effect = currentEffect();
    if (!effect) throw TypeError("onCleanup can only be called inside effects");

    effect.cleanups.add(fn);
};

/**
 * @param {() => Node} fn
 * @returns {Component}
 */
export const component = (fn) => {
    const _component = {
        parent: currentComponent(),
        children: new Set(),
        effects: new Set(),
        mountQueue: [],
        unmountQueue: [],
        root: null,
    };

    if (_component.parent) _component.parent.children.add(_component);

    startComponentScope(_component);
    _component.root = fn();

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

/**
 * @param {Component} component
 * @param {Node} anchor
 */
export function mount(component, anchor) {
    anchor.appendChild(component.root);

    for (const mq of component.mountQueue) mq();
    component.mountQueue = [];

    endComponentScope();
}

/**
 * @param {Component} component 
 */
function unmountChildren(component) {
    for (const child of component.children) unmountChildren(child);
    component.children.clear();

    for (const effect of component.effects) cleanupEffect(effect);
    component.effects.clear();

    for (const umq of component.unmountQueue) umq();
    component.unmountQueue = [];
}

/**
 * @param {Component} component
 */
export function unmount(component) {
    if (component.root && component.root.parentNode) component.root.parentNode.removeChild(component.root);
    unmountChildren(component);
}