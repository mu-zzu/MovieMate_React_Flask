import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Signup() {
    const { signup, user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    
    const [strength, setStrength] = useState({ score: 0, label: "Empty", color: "transparent" });

    // Redirect if user is already logged in
    useEffect(() => {
        if (user) {
            navigate("/", { replace: true });
        }
    }, [user, navigate]);

    // Update password strength indicator as password changes
    useEffect(() => {
        if (!password) {
            setStrength({ score: 0, label: "Empty", color: "transparent" });
            return;
        }

        if (password.length < 6) {
            setStrength({ score: 1, label: "Too Short (Min 6 chars)", color: "#e50914" }); // Red
            return;
        }

        let score = 2; // Basic length met
        const hasNumbers = /\d/.test(password);
        const hasLetters = /[a-zA-Z]/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const hasMixedCases = /[a-z]/.test(password) && /[A-Z]/.test(password);

        if (password.length >= 8 && hasNumbers && hasLetters) {
            score = 3; // Medium
        }

        if (password.length >= 10 && hasNumbers && hasLetters && (hasSpecial || hasMixedCases)) {
            score = 4; // Strong
        }

        if (score === 2) {
            setStrength({ score: 2, label: "Weak", color: "#f39c12" }); // Orange
        } else if (score === 3) {
            setStrength({ score: 3, label: "Medium", color: "#f1c40f" }); // Yellow/Gold
        } else {
            setStrength({ score: 4, label: "Strong", color: "#2ecc71" }); // Green
        }
    }, [password]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Basic front-end validations
        const cleanUsername = username.trim();
        if (!cleanUsername) {
            setError("Username is required.");
            return;
        }

        const emailRegex = /^[\w\.-]+@[\w\.-]+\.\w+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        const result = await signup(cleanUsername, email, password);
        setLoading(false);

        if (!result.success) {
            setError(result.error);
        } else {
            navigate("/", { replace: true });
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

                    <h2 className="auth-title">Sign Up</h2>

                    {error && (
                        <div className="auth-error-alert">
                            <span className="error-icon">⚠️</span>
                            <span className="error-text">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        {/* Username Input */}
                        <div className="auth-field-group">
                            <label htmlFor="signup-username">Username</label>
                            <input
                                type="text"
                                id="signup-username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Choose a username"
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* Email Input */}
                        <div className="auth-field-group">
                            <label htmlFor="signup-email">Email Address</label>
                            <input
                                type="email"
                                id="signup-email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@domain.com"
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* Password Input */}
                        <div className="auth-field-group">
                            <label htmlFor="signup-password">Password</label>
                            <div className="password-input-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="signup-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Create password"
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

                            {/* Password Strength Indicator */}
                            {password && (
                                <div className="strength-indicator-wrapper">
                                    <div className="strength-bar-bg">
                                        <div 
                                            className="strength-bar-fill" 
                                            style={{ 
                                                width: `${(strength.score / 4) * 100}%`,
                                                backgroundColor: strength.color 
                                            }}
                                        />
                                    </div>
                                    <span className="strength-label" style={{ color: strength.color }}>
                                        Strength: {strength.label}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password Input */}
                        <div className="auth-field-group">
                            <label htmlFor="signup-confirm-password">Confirm Password</label>
                            <div className="password-input-wrapper">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="signup-confirm-password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Re-enter password"
                                    required
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className="password-toggle-btn"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                >
                                    {showConfirmPassword ? (
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
                        <button type="submit" className="auth-btn" disabled={loading} id="signup-submit-btn">
                            {loading ? (
                                <div className="auth-button-spinner">
                                    <div className="btn-spinner"></div>
                                    <span>Registering...</span>
                                </div>
                            ) : (
                                "Sign Up"
                            )}
                        </button>
                    </form>

                    <div className="auth-card-footer">
                        <span>Already have an account? </span>
                        <Link to="/login" className="auth-link">Sign In</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;
