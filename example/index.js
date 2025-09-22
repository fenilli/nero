import * as $ from '../src/runtime/index.js';

const Nested = () => {
    const text = $.text();

    $.setText(text, "Nested Hello World");

    $.onCleanup(() => console.log("Nested onCleanup"));

    return text;
};

const App = () => {
    const [show, setShow] = $.signal(true);

    const div = $.element("div");
    const anchor = $.marker();
    div.append(anchor);

    const interval = setInterval(() => {
        setShow(!show());
    }, 2000);

    $.onCleanup(() => clearInterval(interval));

    $.If(anchor, (mount) => {
        if (show()) mount(() => Nested());
    });

    return div;
};

$.render(App, document.body);