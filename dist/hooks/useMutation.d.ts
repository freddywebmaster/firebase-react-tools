export declare function useMutation<T>(fn: () => Promise<T>): {
    isLoading: boolean;
    initMutation: () => Promise<void>;
};
