// ---- Creation ---- //

/**
 * @returns {DocumentFragment}
 */
export const fragment = () => document.createDocumentFragment();

/**
 * @template {keyof HTMLElementTagNameMap} T
 * @param {T} tag
 * @returns {HTMLElementTagNameMap[T]}
 */
export const element = (tag) => document.createElement(tag);

/**
 * @param {string} text
 * @returns {Text}
 */
export const text = (text = '') => document.createTextNode(text);

/**
 * @param {string} text
 * @returns {Comment}
 */
export const comment = (text = '') => document.createComment(text);

// ---- Modification ---- //

/**
 * @param {Element} el
 * @param {string} text
 */
export const setText = (el, text) => el.textContent = text;

/**
 * @param {Element} el 
 * @param {string} name
 * @param {any} value
 */
export const setProp = (el, name, value) => el[name] = value;

/**
 * @param {Element} el
 * @param {string} name
 */
export const removeProp = (el, name) => delete el[name];

/**
 * @param {Element} el
 * @param {string} name
 * @param {string} value
 */
export const setAttr = (el, name, value) => el.setAttribute(name, value);

/**
 * @param {Element} el
 * @param {string} name
 */
export const removeAttr = (el, name) => el.removeAttribute(name);

/**
 * @param {HTMLElement} el
 * @param {Record<string, string | null | undefined | false>} style
 */
export const setStyles = (el, styles) => {
    for (const [k, v] of Object.entries(styles)) {
        if (!v) el.style.removeProperty(k);
        else el.style.setProperty(k, v);
    };
};

/**
 * @param {HTMLElement} el
 * @param {string | Record<string, boolean>} classes
 */
export const setClasses = (el, classes) => {
    if (typeof classes === 'string') el.classList = classes;
    else for (const [cls, on] of Object.entries(classes)) {
        el.classList.toggle(cls, on);
    };
};

// ---- Tree ---- //

/**
 * @param {Element} el
 * @param {Element} node
 */
export const append = (el, node) => el.append(node);

/**
 * @param {Element} el
 * @param {Element} node
 */
export const after = (el, node) => el.after(node);

/**
 * @param {Element} el
 */
export const remove = (el) => el.remove();

// ---- Navigation ---- //

/**
 * @param {Element} el 
 * @returns {ChildNode | undefined}
 */
export const child = (el, n = 0) => el.childNodes[n];

/**
 * @param {Element} el 
 * @returns {ChildNode | undefined}
 */
export const sibling = (el, n = 0) => {
    let node = el.nextSibling;
    while (node && n > 0) {
        node = node.nextSibling;
        n--;
    }

    return node;
};

// ---- Event ---- //

/**
 * @param {HTMLElement} el
 * @param {string} type
 * @param {Function} handler
 */
export const on = (el, type, handler) => {
    el.addEventListener(type, handler);
    return () => el.removeEventListener(type, handler);
};