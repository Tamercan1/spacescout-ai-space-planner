import { useState  } from "react";
import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { register } from "../api/auth";
import "../styles/LoginRegister.css"

function Register() { 

    const { loginUser } = useAuth() // unpack only loginUser function from the auth context

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [inputErrors, setInputErrors] = useState<{ username?: string, password?: string}>({});

    const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>)  => {
        event.preventDefault();
        
        setError("");
        setInputErrors({});
        setLoading(true);

        try {
            if (password === confirmPassword) {
                await register(username, password);
                console.log("User successfully registered");
                loginUser(username, password)
                navigate("/planner")
            }
            else {
                setError("Password must match");
            }
        }
        catch (error: any) {

            if (error.response && error.response.status === 400) {
                const backendErrors = error.response.data;

                setInputErrors({
                    username: backendErrors.username ? backendErrors.username[0] : undefined,
                    password: backendErrors.password ? backendErrors.password[0] : undefined
                });
            }
            else {
                setError("Something went wrong. Please try again later.");
            }
        }
        finally {
            setLoading(false);
        }

    }

    return (
        <div className="login-container">
            <h1>Register</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username</label>
                    <input 
                        id="username" 
                        type="text" 
                        placeholder="Enter your Userrname"
                        value={username} 
                        autoComplete="off"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    {inputErrors.username && <span className="error-text">{inputErrors.username}</span>}
                    <br />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input 
                        id="password" 
                        type="password" 
                        placeholder="Enter your Password"
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                    {inputErrors.password && <span className="error-text">{inputErrors.password}</span>}
                    <br />
                    <label htmlFor="confirm password">Confirm Password</label>
                    <input 
                        id="confirmPassword" 
                        type="password" 
                        placeholder="Confirm your Password"
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                    />
                </div>

                {error && <p className="error-text">{error}</p>}

                <br />
                <button className="btn-primary">
                    {loading ? "Creating your account...": "Create Account"}
                </button>
            </form>
            <a onClick={() => navigate('/login')} className="btn-secondary">Login</a>
        </div>
    )
}

export default Register