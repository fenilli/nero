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

const AnotherChild = () => {
    console.log('mount another child');

    $.onCleanup(() => console.log('AnotherChild component cleanup'));
};

const Child = () => {
    console.log('mount child');

    const grand = $.component(GrandChild);

    $.onCleanup(() => {
        console.log('Child component cleanup');
        grand.cleanup();
    });
};

const App = () => {
    const [show, setShow] = $.signal(true);

    const t = setTimeout(() => setShow(false), 2000);

    {
        const consequent = () => $.component(Child);
        const alternate = () => $.component(AnotherChild);

        $.when((mount) => {
            if (show()) mount(consequent)
            else mount(alternate);
        });
    }

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