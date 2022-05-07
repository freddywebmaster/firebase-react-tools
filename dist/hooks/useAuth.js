"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuth = void 0;
const react_1 = require("react");
const auth_1 = require("firebase/auth");
function useAuth() {
    const auth = (0, auth_1.getAuth)();
    const [user, setUser] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        const unsuscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
                setLoading(false);
            }
            else {
                setUser(null);
                setLoading(false);
            }
        });
        return () => unsuscribe();
        // eslint-disable-next-line
    }, [user]);
    const result = { user, loading };
    return (0, react_1.useMemo)(() => result, [user, loading]);
}
exports.useAuth = useAuth;
