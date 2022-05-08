import { useEffect, useMemo, useState } from "react";
import { getAuth, User } from "firebase/auth";

export interface IUseAuth {
  user: User | null;
  loading: boolean;
}

export function useAuth(): IUseAuth {
  const auth = getAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsuscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setLoading(false);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsuscribe();
    // eslint-disable-next-line
  }, [user]);

  const result = { user, loading } as IUseAuth;

  return useMemo<IUseAuth>(() => result, [user, loading]);
}
