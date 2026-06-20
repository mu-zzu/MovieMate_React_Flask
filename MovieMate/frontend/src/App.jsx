import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import AddMovie from "./pages/AddMovie";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/add"
                    element={<AddMovie />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;