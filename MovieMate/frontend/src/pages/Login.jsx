import { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Login() {
    const { login, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Redirect to home if user is already logged in
    useEffect(() => {
        if (user) {
            const redirectUrl = location.state?.from?.pathname || "/";
            navigate(redirectUrl, { replace: true });
        }
    }, [user, navigate, location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        // Front-end email structure validation
        const emailRegex = /^[\w\.-]+@[\w\.-]+\.\w+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        if (!password || password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        setLoading(true);
        const result = await login(email, password);
        setLoading(false);

        if (!result.success) {
            setError(result.error);
        } else {
            const redirectUrl = location.state?.from?.pathname || "/";
            navigate(redirectUrl, { replace: true });
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-background-overlay" />
            
            <div className="auth-card-container">
                <div className="auth-card">
                    {/* Header Logo */}
                    <div className="auth-logo">
                        <span className="auth-logo-icon">🎬</span>
                        <span className="auth-logo-text">
                            Movie<span>Mate</span>
                        </span>
                    </div>

                    <h2 className="auth-title">Sign In</h2>

                    {error && (
                        <div className="auth-error-alert">
                            <span className="error-icon">⚠️</span>
                            <span className="error-text">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        {/* Email Input */}
                        <div className="auth-field-group">
                            <label htmlFor="login-email">Email Address</label>
                            <input
                                type="email"
                                id="login-email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@domain.com"
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* Password Input */}
                        <div className="auth-field-group">
                            <label htmlFor="login-password">Password</label>
                            <div className="password-input-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="login-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className="password-toggle-btn"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                            <line x1="1" y1="1" x2="23" y2="23" />
                                        </svg>
                                    ) : (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button type="submit" className="auth-btn" disabled={loading} id="login-submit-btn">
                            {loading ? (
                                <div className="auth-button-spinner">
                                    <div className="btn-spinner"></div>
                                    <span>Signing In...</span>
                                </div>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>

                    <div className="auth-card-footer">
                        <span>New to MovieMate? </span>
                        <Link to="/signup" className="auth-link">Sign up now</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
