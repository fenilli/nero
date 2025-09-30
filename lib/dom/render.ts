import { context } from "../runtime";
import { append, remove } from './utils';

export const render = (fn: () => Node, anchor: Node) => context(() => {
    const root = fn();

    append(root, anchor);
    return () => remove(root);
});