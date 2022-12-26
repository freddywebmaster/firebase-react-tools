"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDocumentRT = void 0;
const react_1 = require("react");
async function useDocumentRT(service, id, cb) {
    (0, react_1.useEffect)(() => {
        const unsuscribe = service.documentSuscribe(id, (data) => cb({ ...data.data(), id: data.id }));
        return () => unsuscribe();
    }, []);
}
exports.useDocumentRT = useDocumentRT;
