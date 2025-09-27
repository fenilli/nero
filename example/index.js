import * as h from '../src/dom/index.js';
import * as $ from '../src/runtime/index.js';

const root_child = () => h.text('hello world child');

const Child = (anchor, props) => {
    const text = root_child();

    if (props.title) h.setText(text, props.title);

    h.after(anchor, text);
};

const root = () => {
    const div = h.element('div');
    const h1 = h.element('h1');

    h.append(div, h1);

    const child = h.comment('child');

    h.append(div, child);

    return div;
};

const App = (anchor) => {
    const [count, setCount] = $.signal(0);

    const i = setInterval(() => setCount((v) => v + 1), 1000);

    const div = root();
    const h1 = h.child(div);

    const child = h.sibling(h1);

    Child(child, { title: 'Hello World' });

    $.effect(() => {
        h.setText(h1, `Count: ${count()}`);
    });

    $.onDestroy(() => clearInterval(i));

    h.append(anchor, div);
};

const ctx = h.render(App, document.body);
console.log(JSON.stringify(ctx, undefined, 2));