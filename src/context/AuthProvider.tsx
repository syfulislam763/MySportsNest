import React, { createContext, ReactNode, useState, useContext } from "react";


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