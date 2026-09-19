import { useContext, createContext, useState, type ReactNode } from "react";
import { login } from "../api/auth";


interface AuthContextType {
    isAuthenticated: boolean;
    loginUser: (username: string, password: string) => Promise<void>;
    logoutUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// THE AUTH PROVIDER FOR ISAUT  HENTICATED AND TWO FUNCTIONS: LOGIN AND LOGOUT
export function AuthProvider({ children }: {children: ReactNode}) {

    // isAuthenticated context
    const [isAuthenticated, setIsAuthenticated] = useState(
        Boolean(localStorage.getItem("access_token")) // true if access_token is provided
    );

    // login function context
    const loginUser = async (username: string, password: string) => {
        const tokens = await login(username, password);

        if (tokens) {
            localStorage.setItem("access_token", tokens.access);
            localStorage.setItem("refresh_token", tokens.refresh);
            localStorage.setItem("username", username)
            setIsAuthenticated(true);
        }
        else {
            setIsAuthenticated(false);
        }
    }

    // logout function context
    const logoutUser = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("username")
        setIsAuthenticated(false);
    }

    const provided_contexts: AuthContextType = {
        isAuthenticated,
        loginUser,
        logoutUser
    }

    return (
        <AuthContext.Provider value={provided_contexts}>
            {children}
        </AuthContext.Provider>
    )
    
}

// FOR USING THE AUTHENTICATION CONTEXTS
export function useAuth() {
    const context = useContext(AuthContext);

    if(!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;
}