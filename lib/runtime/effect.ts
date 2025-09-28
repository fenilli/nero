import { type Context, currentContext, popContext, pushContext } from './context';

export interface Effect {
    __name: string;
    __context?: Context;
    __deps: Array<Set<Effect>>;
    __cleanups: Array<Function>;
    run: () => void;
    dispose: () => void;
};

const effectStack: Array<Effect> = [];

export const pushEffect = (effect: Effect) => effectStack.push(effect);
export const popEffect = () => effectStack.pop();
export const currentEffect = () => effectStack[effectStack.length - 1];

export const effect = (fn: () => void | (() => void)) => {
    const effect: Effect = {
        __name: crypto.randomUUID(),
        __context: currentContext(),
        __deps: [],
        __cleanups: [],
        run() {
            this.dispose();

            if (this.__context) pushContext(this.__context);
            pushEffect(this);
            const cleanup = fn();
            if (typeof cleanup === 'function') this.__cleanups.push(cleanup);
            popEffect();
            if (this.__context) popContext();
        },
        dispose() {
            for (const dep of this.__deps) dep.delete(this);
            this.__deps = [];

            for (const cleanup of this.__cleanups) cleanup();
            this.__cleanups = [];
        }
    };

    effect.run();

    if (effect.__context) effect.__context.__effects.add(effect);

    return effect;
};

export const onDispose = (fn: () => void) => {
    const effect = currentEffect();
    if (!effect) throw new TypeError('onDispose can only be called inside an active effect.');
    effect.__cleanups.push(fn);
};