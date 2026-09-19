import { useState  } from "react";
import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/LoginRegister.css"

function Login() { 

    const { loginUser } = useAuth() // unpack only loginUser function from the auth context

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>)  => {
        event.preventDefault();
        
        setError("");
        setLoading(true);

        try {
            await loginUser(username, password);
            console.log("User logged in");
            navigate("/planner")
        }
        catch {
            setError("Invalid username or password");
        }
        finally {
            setLoading(false);
        }

    }

    return (
        <div className="login-container">
            <h1>Login</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username</label>
                    <input 
                        id="username" 
                        type="text" 
                        placeholder="Userrname"
                        value={username} 
                        autoComplete="off"
                        onChange={(e) => setUsername(e.target.value)} 
                    />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input 
                        id="password" 
                        type="password" 
                        placeholder="Password"
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                </div>

                {error && <span className="error-text">{error}</span>}

                <br />
                <button className="btn-login">
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
            <a onClick={() => navigate('/register')} className="btn-secondary">Register</a>
        </div>
    )
}

export default Login