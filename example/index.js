import * as $ from '../src/runtime/index.js';

const app_root = $.element("div");

const App = () => {
    const [count, setCount] = $.signal(0);

    $.effect(() => {
        $.setText(app_root, `Count: ${count()}`);

        $.onCleanup(() => {
            console.log("onCleanup");
        });
    });

    $.onMount(() => console.log("onMount"));
    $.onUnmount(() => console.log("onUnmount"));

    const increment = () => setCount(count() + 1);
    setInterval(increment, 1000);

    return app_root;
};

const app = $.component(App);
$.mount(app, document.body);

setInterval(() => $.unmount(app), 5000)