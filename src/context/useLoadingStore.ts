import { create } from "zustand"


type LoadingState = {
    isLoading: boolean,
    setIsLoading: (val:boolean) => void
}

export const useLoadingStore = create<LoadingState>((set) => ({
    isLoading: false,
    setIsLoading: (val:boolean) => {
        set({isLoading: val})
    }   
}))


export const setLoadingTrue = () => {
    useLoadingStore.getState().setIsLoading(true);
}

export const setLoadingFalse = () => {
    useLoadingStore.getState().setIsLoading(false);
}