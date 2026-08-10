import { FaHome, FaPen, FaUser, } from "react-icons/fa";

function Dashboard() {
  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <div className="w-66 text-white bg-blue-600 p-8">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        <ul className="space-y-8 text-lg py-18">
          <li className="w-full px-2 py-2 hover:text-blue-100 cursor-pointer flex items-center gap-3">
            < FaHome />
            Home</li>
          <li className="w-full px-2 py-2 hover:text-blue-100 cursor-pointer flex items-center gap-3">
            < FaPen />
            Exam</li>
          <li className="w-full px-2 py-2 hover:text-blue-100 cursor-pointer flex items-center gap-3">
            < FaUser/>
            Profile</li>
        </ul>
        <div className="absolute bottom-0 left-0 p-6">
          <button className="bg-white hover:bg-red-700 text-black font-bold py-3 px-20 rounded ">
            Logout
          </button>
        </div>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 p-6 bg-gray-100">
        <h2 className="text-3xl font-semibold">Welcome</h2>
        <p className="mt-4">This is the dashboard content area.</p>
      </div>
    </div>
  );
}

export default Dashboard;