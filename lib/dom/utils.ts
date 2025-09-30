export const parent = <T extends ParentNode>(node: Node): T => node.parentNode as T;
export const child = <T extends ChildNode>(node: Node, n = 0): T => node.childNodes[n] as T;
export const sibling = <T extends ChildNode>(node: Node, n = 1) => {
    let current: T = node as T;
    for (let i = 0; i < n && current; i++) current = current.nextSibling as T;

    return current;
};

export const first = <T extends ChildNode>(node: T): T => node.firstChild as T;
export const last = <T extends ChildNode>(node: T): T => node.lastChild as T;

export const append = (node: Node, parent: Node) => parent.appendChild(node);
export const after = (node: Node, anchor: Node) => parent(anchor).insertBefore(node, anchor.nextSibling);
export const before = (node: Node, anchor: Node) => parent(anchor).insertBefore(node, anchor);
export const replace = (node: Node, replacement: Node) => parent(node).replaceChild(replacement, node);
export const remove = (node: Node) => parent(node).removeChild(node);

export const on = <K extends keyof HTMLElementEventMap>(
    el: HTMLElement,
    event: K,
    handler: (e: HTMLElementEventMap[K]) => void,
): () => void => {
    el.addEventListener(event, handler);

    return () => el.removeEventListener(event, handler);
};

export const off = (onCleanup: () => void) => onCleanup();

export const setText = (node: Node, text: string) => node.textContent = text;

export const setClassName = (el: Element, className: string) => el.className = className;
export const setAttr = (el: Element, name: string, value: string | null) => {
    if (value === null) el.removeAttribute(name);
    else el.setAttribute(name, value);
};

export const setStyles = (el: HTMLElement, styles: Partial<CSSStyleDeclaration>) => Object.assign(el.style, styles);

export const template = (html: string) => {
    html = html.replace(/<!>/g, '<!---->');

    const template = document.createElement('template');
    template.innerHTML = html;

    const content = template.content;
    if (content.childNodes.length === 1) return () => content.firstChild!.cloneNode(true) as HTMLElement;

    return () => content.cloneNode(true) as HTMLTemplateElement;
};