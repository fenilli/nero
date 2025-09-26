import { Context, currentContext } from './context.js';

const EFFECT = 0;

export class Effect extends Context {
    /** @type {Array<Set<Effect>>} */
    _deps = [];

    constructor(fn) {
        super(EFFECT, fn);
    }

    execute() {
        this.cleanup();
        super.execute();
    }

    cleanup() {
        super.cleanup();

        for (const dep of this._deps) dep.delete(this);
        this._deps = [];
    }
}

/**
 * @param {Function} fn 
 * @returns {Effect} 
 */
export const effect = (fn) => {
    const effect = new Effect(fn);
    effect.execute();
    return effect;
};

/**
 * @returns {Effect | undefined}
 */
export const currentEffect = () => {
    const ctx = /** @type {Context} */ (currentContext());
    return ctx && ctx._type === EFFECT ? ctx : undefined;
};