import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import AddMovie from "./pages/AddMovie";
import Navbar from "./components/Navbar";

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
            </Routes>
        </BrowserRouter>
    );
}

export default App;