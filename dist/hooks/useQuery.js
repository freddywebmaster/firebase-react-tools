"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useQuery = void 0;
const react_1 = require("react");
function useQuery(service, setState, options, arrayCache) {
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(false);
    const getData = async () => {
        setIsLoading(true);
        const res = await service.find(options === null || options === void 0 ? void 0 : options.queryOptions);
        if (!res.error)
            setState(res.data);
        setError(res.error);
        setIsLoading(false);
    };
    const refetch = async () => await getData();
    (0, react_1.useEffect)(() => {
        if (arrayCache) {
            arrayCache.length === 0 && getData();
        }
        else {
            getData();
        }
    }, []);
    return {
        isLoading,
        error,
        refetch,
        mutate: service,
    };
}
exports.useQuery = useQuery;
