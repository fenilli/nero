import { context, effect, onDestroy } from "../runtime/index.js";

export const when = (fn) => {
    let currentContext;
    let lastBranch;

    const render = (branch) => {
        if (branch === lastBranch) return;

        if (currentContext) {
            currentContext.destroy();
            currentContext = undefined;
        }

        currentContext = context(branch);
        currentContext.init();

        lastBranch = branch;
    };

    effect(() => {
        let branchWasRendered = false;
        const trackedRender = (branch) => {
            render(branch);
            branchWasRendered = true;
        };

        fn(trackedRender);

        if (!branchWasRendered && currentContext) {
            currentContext.destroy();
            currentContext = undefined;
            lastBranch = undefined;
        }
    });

    onDestroy(() => {
        if (currentContext) currentContext.destroy();
    });
};