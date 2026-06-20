import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
    return (
        <nav className="navbar">
            <h1 className="logo">🎬 MovieMate</h1>

            <div className="nav-links">
                <Link to="/">Home</Link>
                <Link to="/add">+ Add Movie</Link>
            </div>
        </nav>
    );
}

export default Navbar;