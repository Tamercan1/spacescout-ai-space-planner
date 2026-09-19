import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserRound } from "lucide-react";
import "../styles/Navbar.css"


function Navbar({historyToggle}: {historyToggle: () => void}) {

    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const username = localStorage.getItem("username")

    const { logoutUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutUser();
        navigate("/login");
    }

    return (
        <nav className="navbar">
            <button 
                className="history-toggle"
                onClick={historyToggle}
                aria-label="Open history"
            >
                ☰
            </button>

            <h1>    
                <span className="desktop-title">
                    SpaceScout · AI Space Planner
                </span>

                <span className="mobile-title">
                    SpaceScout
                </span>
            </h1>
            
            <div className="account-menu">
                <button
                    className="account-toggle"
                    onClick={() => setIsAccountOpen((open) => !open)}
                    aria-expanded={isAccountOpen}
                >
                    <UserRound size={25} />
                </button>

                {isAccountOpen && (
                    <div className="account-dropdown">
                        <div className="account-username">
                            {username}
                        </div>

                        <button className="logout-btn" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                )}

            </div>
        </nav>
    )
}

export default Navbar