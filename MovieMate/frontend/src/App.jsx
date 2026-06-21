import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home      from "./pages/Home";
import AddMovie  from "./pages/AddMovie";
import EditMovie from "./pages/EditMovie";
import Dashboard from "./pages/Dashboard";
import Navbar    from "./components/Navbar";

function App() {
    return (
        <BrowserRouter>
            <Navbar />

            <Routes>
                <Route path="/"           element={<Home />}      />
                <Route path="/add"        element={<AddMovie />}  />
                <Route path="/edit/:id"   element={<EditMovie />} />
                <Route path="/dashboard"  element={<Dashboard />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;