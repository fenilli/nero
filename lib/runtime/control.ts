import { type Context } from "./context";
import { type ReadableSignal } from "./signal";
import { effect } from "./effect";

export const when = (condition: ReadableSignal<boolean>, consequent: () => Context, alternate?: () => Context) => {
    let consequentNode: Context | null = null;
    let alternateNode: Context | null = null;

    effect(() => {
        const cond = condition();

        if (cond) {
            if (alternateNode) {
                alternateNode.destroy();
                alternateNode = null;
            }

            if (!consequentNode) consequentNode = consequent();
        } else {
            if (consequentNode) {
                consequentNode.destroy();
                consequentNode = null;
            }

            if (!alternateNode && alternate) alternateNode = alternate();
        }
    });
};