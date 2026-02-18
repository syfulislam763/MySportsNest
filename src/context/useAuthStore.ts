import { create } from "zustand";
import {persist, createJSONStorage} from 'zustand/middleware';
import { setHeaderToken, deleteHeaderToken } from "@/constants/Axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthStore {
    user: any;
    refresh: string;
    access: string;
    isAuthenticated: boolean;
    setIsAuthenticated: (val:boolean) => void;
    setUser: (user:any) => void;
    setAccessToken: (token:string) => void;
    setRefreshToken: (token:string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthStore>()(persist(
    (set) => ({
        user: null,
        refresh: '',
        access: '',
        isAuthenticated: false,
        setIsAuthenticated: (isAuthenticated:boolean) => set({isAuthenticated}),
        setUser: (user:any) => set({user}),
        setAccessToken: (access:string) => set(state => {
            setHeaderToken(access);
            return {access}
        }),
        setRefreshToken: (refresh:string) => set({refresh}),
        logout: () => set(state => {
            deleteHeaderToken();
            return {
                user: null,
                refresh: '',
                access: '',
                isAuthenticated: false
            }
        })
    }),
    {
        name: 'auth-storage',
        storage: createJSONStorage(() => AsyncStorage)
    }
))

export const setAuthentication = (val:boolean) => {
    useAuthStore.getState().setIsAuthenticated(val);
}

export const isAuthenticated = ():boolean => {
    return useAuthStore.getState().isAuthenticated;
}

export const setAuthToken = (access:string, refresh: string) => {
    useAuthStore.getState().setAccessToken(access);
    useAuthStore.getState().setRefreshToken(refresh);
}

export const logoutFromApp = () => {
    useAuthStore.getState().logout();
}