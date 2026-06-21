import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Home      from "./pages/Home";
import AddMovie  from "./pages/AddMovie";
import EditMovie from "./pages/EditMovie";
import Dashboard from "./pages/Dashboard";
import Login     from "./pages/Login";
import Signup    from "./pages/Signup";
import Navbar    from "./components/Navbar";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Navbar />

                <Routes>
                    {/* Protected Routes */}
                    <Route 
                        path="/" 
                        element={
                            <ProtectedRoute>
                                <Home />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/add" 
                        element={
                            <ProtectedRoute>
                                <AddMovie />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/edit/:id" 
                        element={
                            <ProtectedRoute>
                                <EditMovie />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/dashboard" 
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } 
                    />

                    {/* Public Routes */}
                    <Route path="/login"  element={<Login />}  />
                    <Route path="/signup" element={<Signup />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;