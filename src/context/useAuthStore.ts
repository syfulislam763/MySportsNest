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

type Profile = {
    email: string,
    full_name: string,
    daily_streak: number,
    nest_count: number,
    saved_posts_count: number,
    phone: string | null,
    bio: string | null,
    profile_picture: string | null,
    profile_completed: boolean,
}

interface AuthStore {
    user: any;
    refresh: string;
    access: string;
    isAuthenticated: boolean;
    preference: Preference,
    profile: Profile | null,

    setPreference: (val:Preference) => void,
    setIsAuthenticated: (val:boolean) => void;
    setUser: (user:any) => void;
    setAccessToken: (token:string) => void;
    setRefreshToken: (token:string) => void;
    setProfile: (val: Profile) => void;
    updateProfile: (val: Partial<Profile>) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthStore>()(persist(
    (set) => ({
        user: null,
        refresh: '',
        access: '',
        profile: null,
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
        setProfile: (val: Profile) => set({profile: val}),
        updateProfile: (val: Partial<Profile>) => set(state => ({
            profile: state.profile ? {...state.profile, ...val} : null
        })),
        logout: () => set(state => {
            deleteHeaderToken();
            return {
                user: null,
                refresh: '',
                access: '',
                isAuthenticated: false,
                profile: null,
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