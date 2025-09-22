/**
 * @template {keyof HTMLElementTagNameMap} K
 * @param {K} tag
 * @returns {HTMLElementTagNameMap[K]}
 */
export const element = (tag) => document.createElement(tag);
export const text = () => document.createTextNode("");
export const marker = () => document.createComment("");

/**
 * @param {Element} node
 * @param {string} text
 */
export const setText = (node, text) => { node.textContent = text };