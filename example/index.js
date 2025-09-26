import * as $ from '../src/runtime/index.js';

const GrandChild = () => {
    const [count, setCount] = $.signal(0);

    $.effect(() => {
        console.log(`GrandChild count: ${count()}`);

        $.onCleanup(() => console.log('GrandChild effect cleanup'));
    });

    const i = setInterval(() => setCount(v => v + 1), 1000);

    $.onCleanup(() => {
        clearInterval(i);
        console.log('GrandChild component cleanup');
    });
};

const Child = () => {
    const grand = $.component(GrandChild);

    $.onCleanup(() => {
        console.log('Child component cleanup');
        grand.cleanup();
    });
};

const App = () => {
    const [show, setShow] = $.signal(true);

    const t = setTimeout(() => setShow(false), 2000);

    $.effect(() => {
        if (show()) {
            const child = $.component(Child);

            $.onCleanup(() => {
                console.log('Conditional Child cleanup');
                child.cleanup();
            });
        }
    });

    $.onCleanup(() => {
        clearTimeout(t);
        console.log('App component cleanup');
    });
};

const root = $.component(App);

setTimeout(() => {
    root.cleanup();
    console.log('Root cleanup');
}, 5000);