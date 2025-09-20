import { after, append, clearRange, fragment, marker, remove } from './dom.js';
import { effect } from './reactive.js';

export function If(condition, consequent) {
    const frag = fragment();
    const start = marker("if:start");
    const end = marker("if:end");
    let current = null;

    effect(() => {
        if (condition()) {
            if (!current) {
                current = consequent;
                after(start, current.frag);
            }
        } else {
            if (current) {
                current.unmount?.();
                clearRange(start, end);
                current = null;
            }
        }
    });

    append(frag, start);
    append(frag, end);

    return frag;
}

export function render(component, container) {
    const _component = typeof component === 'function' ? component() : component;
    if (container.nodeType === Node.COMMENT_NODE) after(container, _component.frag);
    else append(container, _component.frag);

    return component;
}