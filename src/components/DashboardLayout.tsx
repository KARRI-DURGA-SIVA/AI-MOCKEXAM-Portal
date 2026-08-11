import { FaHome, FaPen, FaUser } from "react-icons/fa";
import { Outlet, useNavigate } from "react-router-dom";

function DashboardLayout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate("/login");
    };

    return (
        <div className="flex h-screen">

            {/* Sidebar */}
            <div className="w-72 shrink-0 bg-blue-600 text-white p-8 flex flex-col">

                <h1 className="text-4xl font-bold">
                    Dashboard
                </h1>

                <ul className="space-y-8 text-lg mt-24">

                    <li
                        onClick={() => navigate("/home")}
                        className="px-2 py-2 hover:text-blue-100 cursor-pointer flex items-center gap-3"
                    >
                        <FaHome />
                        Home
                    </li>

                    <li
                        onClick={() => navigate("/exams")}
                        className="px-2 py-2 hover:text-blue-100 cursor-pointer flex items-center gap-3"
                    >
                        <FaPen />
                        Exams
                    </li>

                    <li
                        onClick={() => navigate("/profile")}
                        className="px-2 py-2 hover:text-blue-100 cursor-pointer flex items-center gap-3"
                    >
                        <FaUser />
                        Profile
                    </li>

                </ul>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="mt-auto bg-white hover:bg-gray-100 text-black font-bold py-3 rounded"
                >
                    Logout
                </button>

            </div>

            {/* Page Content */}
            <main className="flex-1 min-w-0 overflow-y-auto bg-gray-100">
                <Outlet />
            </main>

        </div>
    );
}

export default DashboardLayout;