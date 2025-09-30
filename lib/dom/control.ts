import { type Context, type ReadableSignal, effect, context } from '../runtime';
import { after, remove } from './utils';

export const when = (anchor: Node, renderFn: (render: (fn: () => Node) => void) => void) => {
    let node: Context | null = null;
    let lastRender: (() => Node) | null = null;

    effect(() => {
        let rendered: (() => Node) | null = null;

        const render = (fn: () => Node) => {
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

export const each = <T>(anchor: Node, items: ReadableSignal<Array<T>>, key: (item: T, index: number) => string | number, renderFn: (item: T, index: number) => Node) => {
    const nodes: Map<string | number, { context: Context, el: Node }> = new Map();

    effect(() => {
        const list = items();
        const seen = new Set<string | number>();

        let prev: Node = anchor;

        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            const k = key(item, i);
            seen.add(k);

            let entry = nodes.get(k);

            if (!entry) {
                let el: Node;

                const c = context(() => {
                    el = renderFn(item, i);
                    return () => remove(el);
                });

                entry = { context: c, el: el! };
                nodes.set(k, entry);
            }

            const next = prev.nextSibling;
            if (entry.el !== next) after(entry.el, prev);

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