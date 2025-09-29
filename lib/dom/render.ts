import { context } from "../runtime";

type CSSWritable = {
    [K in keyof CSSStyleDeclaration as CSSStyleDeclaration[K] extends string ? K : never]: string;
};

export const fragment = () => document.createDocumentFragment();
export const element = <T extends keyof HTMLElementTagNameMap>(tag: T): HTMLElementTagNameMap[T] => document.createElement(tag);
export const text = (text: string = '') => document.createTextNode(text);
export const comment = (text: string = '') => document.createComment(text);

export const setClassList = (node: Element, classList: string) => {
    node.classList = classList;
};

export const setStyle = (node: HTMLElement, key: keyof CSSWritable, value: string) => {
    node.style[key] = value;
};

export const child = (node: Node, n: number = 0) => node.childNodes[n];
export const sibling = <T extends Node>(node: Node, n: number = 1) => {
    if (n === 0) return node as T;

    let current: Node | null = node;
    for (let i = 0; i < n && current; i++) current = current.nextSibling;

    return current as T;
};

export const append = (node: Node, anchor: Element) => anchor.append(node);
export const after = (node: Node, anchor: ChildNode) => anchor.after(node);
export const insertBefore = (node: Node, anchor: ChildNode) => anchor.parentNode?.insertBefore(node, anchor.nextSibling);
export const remove = (node: ChildNode) => node.remove();

export const render = (fn: () => Element, anchor: Element | null) => context(() => {
    const root = fn();

    if (anchor) append(root, anchor);
    return () => remove(root);
});