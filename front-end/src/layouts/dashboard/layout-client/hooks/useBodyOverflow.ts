import { useEffect } from "react";
import {
    addBodyOverflowHidden,
    removeBodyOverflowHidden,
} from "../utils/dom-helpers";

/**
 * Custom hook to set body overflow to hidden
 */
export function useBodyOverflow() {
    useEffect(() => {
        addBodyOverflowHidden();

        return () => {
            removeBodyOverflowHidden();
        };
    }, []);
}
