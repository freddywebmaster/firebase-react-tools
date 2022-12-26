import { FirestoreService } from "../services/firestore/Firestore";
import { useEffect } from "react";

export async function useDocumentRT<State>(
  service: FirestoreService<State>,
  id: string,
  cb: (data: State) => void
) {
  useEffect(() => {
    const unsuscribe = service.documentSuscribe(id, (data) =>
      cb({ ...data.data(), id: data.id } as unknown as State)
    );

    return () => unsuscribe();
  }, []);
}
