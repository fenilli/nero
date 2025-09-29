import { type Context, type ReadableSignal, effect, context } from '../runtime';
import { after, insertBefore, remove } from './render';

export const when = (anchor: ChildNode, renderFn: (render: (fn: () => ChildNode) => void) => void) => {
    let node: Context | null = null;
    let lastRender: (() => ChildNode) | null = null;

    effect(() => {
        let rendered: (() => ChildNode) | null = null;

        const render = (fn: () => ChildNode) => {
            rendered = fn;

            if (lastRender === fn) return;

            if (node) {
                node.destroy();
                node = null;
            }

            node = context(() => {
                const root = fn();

                after(root, anchor);
                return () => remove(root);
            });

            lastRender = fn;
        };

        renderFn(render);

        if (!rendered && node) {
            node.destroy();
            node = null;
            lastRender = null;
        }
    });
};

export const index = <T>(item: T, index: number) => {
    if (typeof item === 'object') return index;

    return item;
};

export const each = <T>(anchor: ChildNode, items: ReadableSignal<Array<T>>, key: (item: T, index: number) => string | number, renderFn: (item: T, index: number) => ChildNode) => {
    const nodes: Map<string | number, { context: Context, el: ChildNode }> = new Map();

    effect(() => {
        const list = items();
        const seen = new Set<string | number>();

        let prev: ChildNode = anchor;

        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            const k = key(item, i);
            seen.add(k);

            let entry = nodes.get(k);

            if (!entry) {
                let el: ChildNode;

                const c = context(() => {
                    el = renderFn(item, i);

                    insertBefore(el, prev);
                    return () => remove(el);
                });

                entry = { context: c, el: el! };
                nodes.set(k, entry);
            } else {
                if (entry.el.previousSibling !== prev) {
                    insertBefore(entry.el, prev);
                }
            }

            prev = entry.el;
        }

        for (const [k, entry] of nodes) {
            if (!seen.has(k)) {
                entry.context.destroy();
                nodes.delete(k);
            }
        }
    });
};