import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">

            {/* Header */}
            <header className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">

                    <div className="flex items-center gap-3">
                        <img
                            src="src/assets/3u.png"
                            alt="AI Exam Portal"
                            className="w-14 h-14"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate("/login")}
                            className="text-blue-600 font-semibold hover:text-blue-700"
                        >
                            Login
                        </button>

                        <button
                            onClick={() => navigate("/signup")}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
                        >
                            Sign Up
                        </button>
                    </div>

                </div>
            </header>


            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-8 py-20 grid grid-cols-1 md:grid-cols-2 items-center gap-10">

                {/* Left Side */}
                <div>

                    <h2 className="text-5xl font-extrabold text-gray-800 mt-6 leading-tight">
                        Smart &
                        <span className="text-blue-600"> Secure </span>
                        Online Examination
                    </h2>

                    <p className="text-gray-600 mt-6 text-lg leading-8">
                        Conduct online examinations with AI-powered monitoring,
                        automated evaluation, real-time analytics, and secure
                        proctoring to ensure fairness and efficiency.
                    </p>

                    <div className="mt-8 flex gap-4">
                        <button
                            onClick={() => navigate("/login")}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition"
                        >
                            Get Started
                        </button>

                        <button
                            onClick={() => navigate("/signup")}
                            className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition"
                        >
                            Create Account
                        </button>
                    </div>

                </div>


                {/* Right Side */}
                <div className="flex justify-center">
                    <img
                        src="src/assets/3u.png"
                        alt="AI Exam Portal"
                        className="w-80 md:w-96 drop-shadow-2xl"
                    />
                </div>

            </section>



        </div>
    );
}

export default Home;
