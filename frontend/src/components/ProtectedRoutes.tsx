import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Navbar from "./Navbar";


export interface LayoutContext {
    isHistoryOpen: boolean;
    setIsHistoryOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function ProtectedRoute() {
    const { isAuthenticated } = useAuth();
    const [isHistoryOpen, setIsHistoryOpen] = useState(
        () => window.matchMedia("(min-width: 901px)").matches
    );

    if(!isAuthenticated) {
        return <Navigate to='/login' replace />;
    }

    return (
        <>
        <Navbar historyToggle={() => setIsHistoryOpen((open) => !open)}/>
        <Outlet context={{
            isHistoryOpen,
            setIsHistoryOpen,
        }}/>
        </>
    )
}

export default ProtectedRoute