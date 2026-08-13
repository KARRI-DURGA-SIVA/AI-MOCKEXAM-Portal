import { useNavigate } from "react-router-dom";
import { ChartNoAxesColumnIncreasing, Trophy, FileCheck2 } from "lucide-react";

function Home() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#f3f4f6]">
            <header className="bg-white shadow-sm">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
                    <div className="flex items-center gap-3">
                        <img src="src/assets/3u.png" alt="AI Exam Portal" className="h-14 w-14" />
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate("/login")}
                            className="font-semibold text-blue-600 hover:text-blue-700"
                        >
                            Login
                        </button>

                        <button
                            onClick={() => navigate("/signup")}
                            className="rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700"
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
            </header>

            <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-8 py-20 md:grid-cols-2">
                <div>
                    <h2 className="mt-6 text-5xl font-extrabold leading-tight text-gray-800">
                        Smart &
                        <span className="text-blue-600"> Secure </span>
                        Online Examination
                    </h2>

                    <p className="mt-6 text-lg leading-8 text-gray-600">
                        Conduct online examinations with AI-powered monitoring,
                        automated evaluation, real-time analytics, and secure
                        proctoring to ensure fairness and efficiency.
                    </p>

                    <div className="mt-8 flex gap-4">
                        <button
                            onClick={() => navigate("/login")}
                            className="rounded-lg bg-blue-600 px-8 py-3 text-white transition hover:bg-blue-700"
                        >
                            Get Started
                        </button>

                        <button
                            onClick={() => navigate("/signup")}
                            className="rounded-lg border border-blue-600 px-8 py-3 text-blue-600 transition hover:bg-blue-50"
                        >
                            Create Account
                        </button>
                    </div>
                </div>

                <div className="flex justify-center">
                    <img
                        src="src/assets/3u.png"
                        alt="AI Exam Portal"
                        className="w-80 drop-shadow-2xl md:w-96"
                    />
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-8 pb-16">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Your Exam Performance</h2>
                    <p className="mt-2 text-gray-500">Track your progress and performance at a glance</p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="rounded-xl border border-gray-100 bg-white p-7 shadow-sm transition hover:shadow-md">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                            <FileCheck2 size={25} />
                        </div>
                        <p className="mt-6 text-sm text-gray-500">Exams Taken</p>
                        <p className="mt-2 text-4xl font-bold text-gray-800">12</p>
                        <p className="mt-2 text-sm text-gray-500">Total examinations completed</p>
                    </div>

                    <div className="rounded-xl border border-gray-100 bg-white p-7 shadow-sm transition hover:shadow-md">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                            <ChartNoAxesColumnIncreasing size={25} />
                        </div>
                        <p className="mt-6 text-sm text-gray-500">Average Score</p>
                        <p className="mt-2 text-4xl font-bold text-gray-800">78%</p>
                        <p className="mt-2 text-sm text-gray-500">Average performance across exams</p>
                    </div>

                    <div className="rounded-xl border border-gray-100 bg-white p-7 shadow-sm transition hover:shadow-md">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                            <Trophy size={25} />
                        </div>
                        <p className="mt-6 text-sm text-gray-500">Best Score</p>
                        <p className="mt-2 text-4xl font-bold text-gray-800">94%</p>
                        <p className="mt-2 text-sm text-gray-500">Your highest exam score</p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;