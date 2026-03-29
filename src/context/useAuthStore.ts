import { create } from "zustand";
import {persist, createJSONStorage} from 'zustand/middleware';
import { setHeaderToken, deleteHeaderToken } from "@/constants/Axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Preference = {
    show_live_scores: boolean,
    breaking_news_only: boolean,
    breaking_news_notifications: boolean,
    game_start_notifications: boolean,
    sources_limit: number,
    sources_used: number
}

interface AuthStore {
    user: any;
    refresh: string;
    access: string;
    isAuthenticated: boolean;
    preference: Preference,

    setPreference: (val:Preference) => void,
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
        preference: {
            show_live_scores: true,
            breaking_news_only: true,
            breaking_news_notifications: true,
            game_start_notifications: true,
            sources_limit: 3,
            sources_used: 0
        },
        setPreference: (val: Preference) => set({preference: val}),
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