/**
 * @template {keyof HTMLElementTagNameMap} K
 * @param {K} tag
 * @returns {HTMLElementTagNameMap[K]}
 */
export const element = (tag) => document.createElement(tag);

/**
 * @param {Node} node
 * @param {string} text
 */
export const setText = (node, text) => { node.textContent = text };