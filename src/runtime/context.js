/**
 * @type {Array<Context>}
 */
const contextStack = [];

/**
 * @param {Context} context 
 */
export const pushContext = (context) => contextStack.push(context);
export const popContext = () => contextStack.pop();

/**
 * @type {Context | undefined}
 */
export const currentContext = () => contextStack[contextStack.length - 1];

export class Context {
    /** @type {() => (void | () => void)} */
    _fn;
    /** @type {Number} */
    _type;
    /** @type {Array<Context>} */
    _children = [];
    /** @type {Array<Function>} */
    _cleanups = [];

    constructor(type, fn) {
        const parent = /** @type {Context | undefined} */ (currentContext());
        this._type = type;
        this._fn = fn;

        if (parent) parent._children.push(this);
    }

    execute() {
        pushContext(this);
        this._fn();
        popContext();
    }

    cleanup() {
        for (const child of this._children) child.cleanup();
        this._children = [];

        for (const cleanup of this._cleanups) cleanup();
        this._cleanups = [];
    }
}