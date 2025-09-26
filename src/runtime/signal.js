import { currentEffect } from './effect.js';

let pending = new Set();
let scheduled = false;

const schedule = (effect) => {
    pending.add(effect);
    if (scheduled) return;

    scheduled = true;
    queueMicrotask(() => {
        scheduled = false;
        for (const effect of [...pending]) effect.execute();
        pending.clear();
    });
};

export const signal = (initial) => {
    let value = initial;
    const subscribers = new Set();

    function read() {
        const effect = currentEffect();
        if (effect) {
            subscribers.add(effect);
            effect._deps.push(subscribers);
        }

        return value;
    }

    function write(next) {
        const v = typeof next === 'function' ? next(value) : next;
        if (v === value) return;
        value = v;
        for (const effect of [...subscribers]) schedule(effect);
    }

    return [read, write];
}