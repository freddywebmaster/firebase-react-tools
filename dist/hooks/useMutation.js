"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMutation = void 0;
const react_1 = require("react");
function useMutation(fn) {
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const initMutation = async () => {
        if (isLoading)
            return;
        setIsLoading(true);
        await fn();
        setIsLoading(false);
    };
    return {
        isLoading,
        initMutation,
    };
}
exports.useMutation = useMutation;
