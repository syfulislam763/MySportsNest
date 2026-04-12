import React, { createContext, ReactNode, useState, useContext, useEffect, useRef, useCallback } from "react";
import { useAuthStore } from "./useAuthStore";
import { setHeaderToken } from "@/constants/Axios";
import { SOCKET_BASE_URL } from "@/constants/Path";

interface LiveGame {
    id: number;
    sport: string;
    home_team: string;
    away_team: string;
    home_logo: string;
    away_logo: string;
    home_score: number | null;
    away_score: number | null;
    status: string;
    status_detail: string;
    start_time: string;
    updated_at: string;
}

type AuthProviderProps = {
    children: ReactNode;
};

type AuthContextProps = {
    isAuthenticated: boolean;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    liveScores: LiveGame[];
};

const AuthContext = createContext<AuthContextProps | undefined | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [liveScores, setLiveScores] = useState<LiveGame[]>([]);
    const socketRef = useRef<WebSocket | null>(null);
    const token = useAuthStore((s) => s.access);

    useEffect(() => {
        setHeaderToken(token);
    }, []);

    const connectSocket = useCallback(() => {
        if (!token) return;
        if (socketRef.current) {
            socketRef.current.close();
            socketRef.current = null;
        }

        const ws = new WebSocket(`${SOCKET_BASE_URL}/ws/scores/live/?token=${token}`);
        socketRef.current = ws;

        ws.onmessage = (e) => {
            try {
                const data = JSON.parse(e.data);
                if (data.type === 'snapshot') {
                    setLiveScores(data.games ?? []);
                } else if (data.type === 'update' && data.game) {
                    setLiveScores((prev) => {
                        const idx = prev.findIndex((g) => g.id === data.game.id);
                        if (idx === -1) return [data.game, ...prev];
                        const updated = [...prev];
                        updated[idx] = data.game;
                        return updated;
                    });
                }
            } catch {}
        };

        ws.onclose = () => {
            socketRef.current = null;
        };

        ws.onerror = () => {};
    }, [token]);

    useEffect(() => {
        if (token) {
            connectSocket();
        } else {
            socketRef.current?.close();
            socketRef.current = null;
            setLiveScores([]);
        }

        return () => {
            socketRef.current?.close();
            socketRef.current = null;
        };
    }, [token, connectSocket]);

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, liveScores }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};