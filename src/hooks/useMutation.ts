import { useState } from "react";

export function useMutation<T>(fn: () => Promise<T>) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const initMutation = async () => {
    if (isLoading) return;

    setIsLoading(true);

    await fn();

    setIsLoading(false);
  };

  return {
    isLoading,
    initMutation,
  };
}
