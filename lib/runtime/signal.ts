import { type Effect, currentEffect } from "./effect";

export type ReadableSignal<T> = () => T;
export type WritableSignal<T> = (next: T | ((value: T) => T)) => void;
export type Signal<T> = [ReadableSignal<T>, WritableSignal<T>];

let pending: Set<Effect> = new Set();
let scheduled = false;

const schedule = (effect: Effect) => {
    pending.add(effect);
    if (scheduled) return;

    scheduled = true;
    queueMicrotask(() => {
        scheduled = false;
        for (const effect of [...pending]) effect.run();
        pending.clear();
    });
};

export const signal = <T>(initial: T): Signal<T> => {
    let value = initial;
    const subscribers: Set<Effect> = new Set();

    const read: ReadableSignal<T> = () => {
        const effect = currentEffect();

        if (effect) {
            subscribers.add(effect);
            effect.__deps.push(subscribers);
        }

        return value;
    };

    const write: WritableSignal<T> = (next) => {
        const v = typeof next === 'function' ? (next as (value: T) => T)(value) : next;

        value = v;
        for (const effect of [...subscribers]) schedule(effect);
    };

    return [read, write];
};