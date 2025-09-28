import { type Effect } from './effect';

export interface Context {
    __name: string;
    __parent?: Context;
    __children: Set<Context>;
    __effects: Set<Effect>;
    __cleanups: Array<Function>;
    destroy: () => void;
};

const contextStack: Array<Context> = [];

export const pushContext = (context: Context) => contextStack.push(context);
export const popContext = () => contextStack.pop();
export const currentContext = () => contextStack[contextStack.length - 1];

export const context = (fn: () => void | (() => void)) => {
    const context: Context = {
        __name: crypto.randomUUID(),
        __parent: currentContext(),
        __children: new Set(),
        __effects: new Set(),
        __cleanups: [],
        destroy() {
            for (const child of this.__children) child.destroy();
            this.__children.clear();

            for (const effect of this.__effects) effect.dispose();
            this.__effects.clear();

            for (const cleanup of this.__cleanups) cleanup();
            this.__cleanups = [];

            if (this.__parent) this.__parent.__children.delete(this);
        }
    };

    pushContext(context);
    const cleanup = fn();
    if (typeof cleanup === 'function') context.__cleanups.push(cleanup);
    popContext();

    if (context.__parent) context.__parent.__children.add(context);

    return context;
};

export const onDestroy = (fn: () => void) => {
    const context = currentContext();
    if (!context) throw new TypeError('onDestroy can only be called inside an active context.');
    context.__cleanups.push(fn);
};