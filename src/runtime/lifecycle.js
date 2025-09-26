import { currentContext } from './context.js';

/**
 * @param {Function} fn 
 */
export const onCleanup = (fn) => {
    const ctx = currentContext();
    if (!ctx) throw TypeError('onCleanup can be only added to an active context');

    ctx._cleanups.push(fn);
};

