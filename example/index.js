import * as $ from '../src/runtime/index.js';


const Counter = () => {
    const [count, setCount] = $.signal(0);

    const counter_root = $.element("span");

    $.effect(() => {
        $.setText(counter_root, `Count: ${count()}`);
    });

    $.onMount(() => {
        console.log("Counter: onMount");
        const interval = setInterval(() => setCount(count() + 1), 1000);

        return () => console.log(clearInterval(interval), "Counter: cleared interval");
    });

    $.onUnmount(() => {
        console.log("Counter: onUnmount");
    });


    return counter_root;
};


const App = () => {
    const div = $.element("div");

    const couter = $.component(Counter);
    $.mount(couter, div);

    $.onMount(() => {
        console.log("App: onMount")
        const timeout = setTimeout(() => $.unmount(couter), 2000);

        return () => console.log(clearTimeout(timeout), "App: cleared timeout");
    });

    $.onUnmount(() => {
        console.log("App: onUnmount");
    });


    return div;
};

const app = $.component(App);
$.mount(app, document.body);

setTimeout(() => $.unmount(app), 5000);