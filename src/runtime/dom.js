export function fragment() {
    return document.createDocumentFragment();
}

export function element(tag) {
    return document.createElement(tag);
}

export function text(text) {
    return document.createTextNode(text);
}

export function marker(name) {
    return document.createComment(name);
}

export function setProperty(node, name, value) {
    node[name] = value;
}

export function setAttribute(node, name, value) {
    if (value === null || value === false) node.removeAttribute(name);
    else if (value === true) node.setAttribute(name, "");
    else node.setAttribute(name, value);
}

export function setClassName(node, value) {
    if (value === null || value === false) node.removeAttribute("class");
    else node.className = value;
}

export function setText(node, text) {
    node.textContent = text;
}

export function child(node, n = 0) {
    return node.childNodes[n];
}

export function sibling(node, n = 1) {
    let sibling = node;
    while (n-- > 0 && sibling) { sibling = sibling.nextSibling }
    return sibling;
}

export function on(node, type, listener) {
    node.addEventListener(type, listener);
}

export function off(node, type, listener) {
    node.removeEventListener(type, listener);
}

export function append(node, child) {
    node.append(child);
}

export function prepend(node, child) {
    node.prepend(child);
}

export function before(node, element) {
    node.before(element);
}

export function after(node, element) {
    node.after(element);
}

export function remove(node) {
    node.remove();
}

export function clearRange(start, end) {
    let node = start.nextSibling;
    while (node && node !== end) {
        const next = node.nextSibling;
        node.remove();
        node = next;
    }
}