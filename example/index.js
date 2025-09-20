import * as $ from '../src/runtime/index.js';

function Child() {
    const [count, setCount] = $.signal(0);
    const double = $.derive(() => count() * 2);

    const frag = $.fragment();
    const textNode = $.text();

    $.effect(() => {
        $.setText(textNode, `Hello World: ${count()} and doubled: ${double()}`);
    });

    $.effect(() => {
        const id = setInterval(() => {
            setCount(count() + 1);
        }, 1000);

        return () => clearInterval(id);
    });

    $.append(frag, textNode);

    return { frag, unmount: () => { console.log("Unmounted") } };
}

function App() {
    const [count, setCount] = $.signal(0);

    const frag = $.fragment();
    const container = $.element("div");
    $.setClassName(container, "my-class");

    $.effect(() => {
        const id = setInterval(() => setCount(count() + 1), 1000);
        return () => clearInterval(id);
    });

    {
        const fragment = $.If(() => count() >= 1 && count() <= 3, Child());

        $.append(container, fragment);
    }

    $.append(frag, container);

    return { frag };
}

$.render(App, document.body);