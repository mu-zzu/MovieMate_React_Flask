import { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const [scrolled, setScrolled]     = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [location]);

    const isActive = (path) => location.pathname === path;

    const handleLogoutClick = async () => {
        await logout();
    };

    // User's first letter for avatar
    const avatarLetter = user && user.username ? user.username.charAt(0).toUpperCase() : "U";

    return (
        <>
            <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
                {/* Logo */}
                <Link to="/" className="nav-logo">
                    <div className="nav-logo-icon">🎬</div>
                    <span className="nav-logo-text">
                        Movie<span>Mate</span>
                    </span>
                </Link>

                {/* Desktop links */}
                {user ? (
                    <>
                        <div className="nav-links">
                            <Link
                                to="/"
                                className={`nav-link ${isActive("/") ? "active" : ""}`}
                                id="nav-home-link"
                            >
                                🏠 Home
                            </Link>
                            <Link
                                to="/dashboard"
                                className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}
                                id="nav-dashboard-link"
                            >
                                📊 Dashboard
                            </Link>
                            <Link
                                to="/add"
                                className="nav-link nav-add"
                                id="nav-add-link"
                            >
                                + Add Movie
                            </Link>
                        </div>

                        {/* User Profile & Logout section */}
                        <div className="nav-user-section">
                            <div className="nav-user-profile" title={`Logged in as ${user.username}`}>
                                <div className="nav-user-avatar">{avatarLetter}</div>
                                <span className="nav-username">{user.username}</span>
                            </div>
                            <button
                                onClick={handleLogoutClick}
                                className="nav-logout-btn"
                                id="nav-logout-btn"
                            >
                                Logout
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="nav-auth-buttons">
                        <Link
                            to="/login"
                            className={`nav-link nav-login-btn ${isActive("/login") ? "active" : ""}`}
                            id="nav-login-btn"
                        >
                            Sign In
                        </Link>
                        <Link
                            to="/signup"
                            className="nav-signup-btn"
                            id="nav-signup-btn"
                        >
                            Sign Up
                        </Link>
                    </div>
                )}

                {/* Hamburger (mobile) */}
                {user && (
                    <button
                        className={`nav-hamburger ${mobileOpen ? "open" : ""}`}
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle navigation menu"
                        id="nav-hamburger-btn"
                    >
                        <span />
                        <span />
                        <span />
                    </button>
                )}
            </nav>

            {/* Mobile drawer (only for logged in users) */}
            {user && (
                <div className={`nav-mobile-menu ${mobileOpen ? "open" : ""}`}>
                    <div className="nav-mobile-user-info">
                        <div className="nav-user-avatar">{avatarLetter}</div>
                        <span className="nav-username">{user.username}</span>
                    </div>
                    <Link
                        to="/"
                        className={`nav-link ${isActive("/") ? "active" : ""}`}
                        id="nav-mobile-home"
                    >
                        🏠 Home
                    </Link>
                    <Link
                        to="/dashboard"
                        className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}
                        id="nav-mobile-dashboard"
                    >
                        📊 Dashboard
                    </Link>
                    <Link
                        to="/add"
                        className="nav-link nav-add"
                        id="nav-mobile-add"
                    >
                        + Add Movie
                    </Link>
                    <button
                        onClick={handleLogoutClick}
                        className="nav-mobile-logout-btn"
                        id="nav-mobile-logout"
                    >
                        Logout
                    </button>
                </div>
            )}
        </>
    );
}

export default Navbar;