import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function ProtectedRoute({ children }) {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return (
            <div className="auth-loading-screen">
                <div className="auth-spinner-container">
                    <div className="auth-spinner"></div>
                    <p className="auth-loading-text">Loading your cinema...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        // Save the current location the user was trying to access so we can redirect them back after they log in
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return children;
}

export default ProtectedRoute;
