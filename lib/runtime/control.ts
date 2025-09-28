import { type Context } from "./context";
import { type ReadableSignal } from "./signal";
import { effect } from "./effect";

export const when = (condition: ReadableSignal<boolean>, consequent: () => Context, alternate?: () => Context) => {
    let consequentNode: Context | null = null;
    let alternateNode: Context | null = null;

    effect(() => {
        const cond = condition();

        if (cond) {
            if (alternateNode) {
                alternateNode.destroy();
                alternateNode = null;
            }

            if (!consequentNode) consequentNode = consequent();
        } else {
            if (consequentNode) {
                consequentNode.destroy();
                consequentNode = null;
            }

            if (!alternateNode && alternate) alternateNode = alternate();
        }
    });
};

export const index = <T>(item: T) => item;

export const each = <T>(items: ReadableSignal<Array<T>>, key: (item: T) => string | number, render: (item: T) => Context) => {
    const nodes: Map<string | number, Context> = new Map();

    effect(() => {
        const list = items();
        const seen = new Set<string | number>();

        for (const item of list) {
            const k = key(item);
            seen.add(k);

            const context = nodes.get(k);
            if (!context) nodes.set(k, render(item));
        }

        for (const [k, context] of nodes) {
            if (!seen.has(k)) {
                context.destroy();
                nodes.delete(k);
            }
        }
    });
};