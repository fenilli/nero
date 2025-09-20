let context = [];

let effectQueue = new Set();
let flushing = false;

function subscribe(running, subscriptions) {
    subscriptions.add(running);
    running.dependencies.add(subscriptions);
}

function unsubscribe(running) {
    for (const dep of running.dependencies) dep.delete(running);
    running.dependencies.clear();
}

function flush() {
    flushing = true;
    queueMicrotask(() => {
        for (const effect of effectQueue) effect.execute();
        effectQueue.clear();
        flushing = false;
    });
}

export function signal(initial) {
    let value = initial;
    const subscriptions = new Set();

    function read() {
        const running = context[context.length - 1];
        if (running) subscribe(running, subscriptions);
        return value;
    }

    function write(newVal) {
        if (newVal === value) return;

        value = newVal;

        for (const sub of [...subscriptions]) effectQueue.add(sub);
        if (!flushing) flush();
    }

    return [read, write];
}

export function derive(fn) {
    let [value, setValue] = signal(fn());
    effect(() => setValue(fn()));
    return value;
}

export function effect(fn) {
    function execute() {
        for (const cleanup of running.cleanups) cleanup();
        running.cleanups.clear();

        unsubscribe(running);
        context.push(running);

        try {
            const cleanup = fn();
            if (typeof cleanup === 'function') running.cleanups.add(cleanup);
        } finally {
            context.pop();
        }
    }

    const running = {
        execute,
        dependencies: new Set(),
        cleanups: new Set(),
    };

    execute();
}

export function onCleanup(fn) {
    const running = context[context.length - 1];
    if (!running) throw Error("onCleanup should be called inside an effect");

    running.cleanups.add(fn);
}