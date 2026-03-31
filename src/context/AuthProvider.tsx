import React, { createContext, ReactNode, useState, useContext, useEffect } from "react";

import { useAuthStore } from "./useAuthStore";
import { setHeaderToken } from "@/constants/Axios";
type AuthProviderProps = {
    children: ReactNode
}
type AuthContextProps = {
    isAuthenticated: boolean,
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>     
}

const AuthContext = createContext<AuthContextProps | undefined | null >(null);

export const AuthProvider = ({children}:AuthProviderProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const token = useAuthStore((s) => s.access)


    useEffect(() => {
        console.log("token", token)
        setHeaderToken(token);
    }, [])

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated, 
                setIsAuthenticated,
            }}
        >
            {children}
        </AuthContext.Provider>
    )

}

export const useAuth = () => {
    const context= useContext(AuthContext);
    if(!context) throw new Error("useAuth must be used within an AuthProvider");

    return context;
}