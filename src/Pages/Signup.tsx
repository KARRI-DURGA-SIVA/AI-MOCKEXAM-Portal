import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { useEffect } from "react"
import { signInWithPopup } from "firebase/auth"
import { FirebaseError } from "firebase/app"
import { auth, provider } from "../firebase"

function Signup() {
    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;

        if (showToast) {
            timeout = setTimeout(() => {
                setShowToast(false);
            }, 2200);
        }

        return () => clearTimeout(timeout);
    }, [showToast]);

    const signupSuccess = () => {
        setShowToast(true);
        setTimeout(() => {
            navigate("/dashboard");
        }, 1000);
    };

    const handleGoogleSignup = async () => {
        try {
            const result = await signInWithPopup(auth, provider);

            const user = result.user;

            signupSuccess();

        } catch (error) {
            if (error instanceof FirebaseError) {
                alert(error.message);
            } else {
                alert("Google Sign-Up failed");
            }
        }
    };

    return (
        <div className="min-h-screen bg-white flex">
            <div className="w-5/3 bg-blue-500 flex flex-col items-center justify-center p-8">
                <h1 className="text-5xl text-white font-extrabold">
                    AI EXAM PORTAL
                </h1>
                <p className="mt-4 text-white text-xl">
                    Welcome Back
                </p>
            </div>
            <div className="w-5/4 flex flex-col items-center justify-center p-8">
                <img src="src/assets/3u.png" alt="Login" className="w-15 -translate-y-20" />
                <h2 className="font-poppins text-4xl font-extrabold text-blue-600 text-center mb-8 -translate-y-10">
                    Sign Up
                </h2>

                <div className="relative w-80 mb-10">
                    <label
                        htmlFor="name"
                        className="absolute -top-6 left-0 text-sm font-medium text-gray-700"
                    >
                        Name
                    </label>

                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Enter your Name"
                        className="w-full border border-gray-600  px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                </div>
                <div className="relative w-80 mb-10">
                    <label
                        htmlFor="email"
                        className="absolute -top-6 left-0 text-sm font-medium text-gray-700"
                    >
                        Email
                    </label>

                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="Enter your Email"
                        className="w-full border border-gray-600  px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                </div>
                <div className="relative w-80 mb-6">
                    <label
                        htmlFor="password"
                        className="absolute -top-6 left-0 text-sm font-medium text-gray-700"
                    >
                        Password
                    </label>

                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Enter your password"
                        className="w-full border border-gray-600  px-4 py-2 pr-12 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />

                    {password.length > 0 && (
                        <button
                            type="button"
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                        </button>
                    )}
                </div>
                <button
                    className="w-80 max-w-full rounded-xl bg-blue-600 py-2.5 text-white transition hover:bg-blue-700"
                    onClick={() => navigate('/dashboard')}
                >
                    Sign Up
                </button>

                {showToast && (
                    <div className="fixed left-1/2 top-6 z-50 -translate-x-1/2">
                        <div
                            className="overflow-hidden rounded-full bg-white shadow-[0_20px_60px_rgba(45,85,255,0.12)] ring-1 ring-slate-200"
                            style={{ minWidth: '320px', maxWidth: '320px' }}
                        >
                            <div className="h-1 bg-blue-500" />

                            <div className="flex items-center gap-2 px-6 py-2">
                                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full text-green-700">
                                    <svg
                                        width="22"
                                        height="22"
                                        viewBox="0 0 20 20"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M6 12.5l4 4 8-8" />
                                    </svg>
                                </div>

                                <p className="ml-5 mt-2 text-base font-semibold text-slate-900 ">
                                    Login Successfully
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <button
                    onClick={handleGoogleSignup}
                    className="w-80 max-w-full mt-4 flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-2 bg-white hover:bg-gray-100 transition"
                >
                    <FcGoogle size={22} />
                    <span className="font-medium text-gray-700">Continue with Google</span>
                </button>
                <div className="mt-4 flex items-center justify-center text-sm">
                    <span className="text-gray-700">
                        Already have an account?
                    </span>

                    <button
                        onClick={() => navigate("/login")}
                        className="ml-2 text-blue-600 font-medium hover:text-blue-800 hover:underline -ml-1"
                    >
                        Login
                    </button>
                </div>
            </div>
        </div>
    )
}
export default Signup;