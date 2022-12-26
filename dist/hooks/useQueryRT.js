"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useQueryRT = void 0;
const react_1 = require("react");
async function useQueryRT(service, cb, queryOptions) {
    (0, react_1.useEffect)(() => {
        const unsuscribe = service.collectionSuscribe(cb, queryOptions);
        return () => unsuscribe();
    }, []);
}
exports.useQueryRT = useQueryRT;
