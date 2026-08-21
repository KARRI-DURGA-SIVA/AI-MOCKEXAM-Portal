import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Dashboard from "./Pages/Dashboard";
import Exam from "./Pages/Exam";
import Profile from "./Pages/Profile";
import Status from "./Pages/Status";
import Instruction from "./Pages/Instruction";

import DashboardLayout from "./components/DashboardLayout";
import CameraAudioCheck from "./Pages/CameraAudioCheck";

function App() {
    return (
        <Routes>
            <Route path="/instruction" element={<Instruction />}/>
            <Route path="/camera-audio-check"element={<CameraAudioCheck />}/>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/status" element={<Status/>}/>
                <Route path="/exams" element={<Exam />} />
                <Route path="/profile" element={<Profile />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;