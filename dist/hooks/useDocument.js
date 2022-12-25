"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDocument = void 0;
const react_1 = require("react");
function useDocument(service, setState, id, objectCache) {
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(false);
    const getData = async () => {
        setIsLoading(true);
        const res = await service.findById(id);
        if (!res.error)
            setState(res.data);
        setError(res.error);
        setIsLoading(false);
    };
    const refetch = async () => await getData();
    (0, react_1.useEffect)(() => {
        if (objectCache) {
            Object.keys(objectCache).length === 0 && getData();
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
exports.useDocument = useDocument;
