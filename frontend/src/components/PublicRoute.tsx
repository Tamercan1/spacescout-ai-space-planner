import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

function PublicRoute() {
    const { isAuthenticated } = useAuth()

    if (isAuthenticated) {
        return <Navigate to={"/planner"} replace/>
    }

    return (
        <Outlet />
    )
}

export default PublicRoute