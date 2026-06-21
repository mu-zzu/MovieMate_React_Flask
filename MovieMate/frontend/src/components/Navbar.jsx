import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
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

                {/* Hamburger (mobile) */}
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
            </nav>

            {/* Mobile drawer */}
            <div className={`nav-mobile-menu ${mobileOpen ? "open" : ""}`}>
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
            </div>
        </>
    );
}

export default Navbar;