import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import AddMovie from "./pages/AddMovie";
import Navbar from "./components/Navbar";
import EditMovie from "./pages/EditMovie";

function App() {
    return (
        <BrowserRouter>
            <Navbar />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route 
                    path="/add"
                    element={<AddMovie />}
                />
                <Route path="/edit/:id" element={<EditMovie />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;