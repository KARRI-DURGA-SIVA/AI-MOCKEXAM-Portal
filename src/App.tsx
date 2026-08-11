import { Routes, Route } from "react-router-dom";

import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Dashboard from "./Pages/Dashboard";
import Profile from "./Pages/Profile";

import DashboardLayout from "./components/DashboardLayout";

function App() {
    return (
        <Routes>

            {/* Public Pages */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Application Pages */}
            <Route element={<DashboardLayout />}>

                <Route path="/dashboard" element={<Dashboard />} />

                <Route path="/home" element={<Home />} />

                <Route path="/profile" element={<Profile />} />

                {/* Add Exams later */}
                {/* <Route path="/exams" element={<Exams />} /> */}

            </Route>

        </Routes>
    );
}

export default App;