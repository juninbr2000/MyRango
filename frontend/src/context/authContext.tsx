import React, {createContext, useContext, useState} from "react";
import type { UserResponse, UserData, loginData } from "../types/userTypes";
import { useAuthentication } from "../Hooks/useAuthentication";

type AuthContextType = {
  user: UserResponse | null;
  loading: boolean;
  error: string | null;
  createUser: ReturnType<typeof useAuthentication>["createUser"];
  login: ReturnType<typeof useAuthentication>["login"];
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider ({ children }: {children: React.ReactNode}) {
    const [user, setUser] = useState<UserResponse | null>(null)
    const { loading, error, createUser: createHook, login: loginHook, logout: logoutHook } = useAuthentication()

    React.useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const login = async (data: loginData) => {
        const userData = await loginHook(data);
        if (userData) {
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData)); 
        }
    };

    const createUser = async (data: UserData) => {
        const userData = await createHook(data);
        if (userData) {
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData)); 
        }
    };

    const logout = () => {
        logoutHook(); 
        setUser(null);
    };

    const value = {
        user,
        loading,
        error,
        createUser,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth deve ser usado dentro de AuthProvider");
    }
    return context;
};