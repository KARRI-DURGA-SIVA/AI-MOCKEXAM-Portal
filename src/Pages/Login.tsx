import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { FcGoogle } from "react-icons/fc";
function Login() {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [password, setPassword] = useState('')
    const [forgotMode, setForgotMode] = useState(false)
    const [resetEmail, setResetEmail] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    return (
        <div className="min-h-screen bg-white flex">
            <div className="w-5/3 bg-blue-500 flex flex-col items-center justify-center p-8">
            <h1 className='text-5xl text-white font-extrabold'>
                AI EXAM PORTAL
            </h1>
             <p className="mt-4 text-white text-xl">
                Welcome Back
            </p>
            </div>
            <div className="w-5/4 flex flex-col items-center justify-center p-8">
                <img src="src/assets/3u.png" alt="Login" className="w-15 -translate-y-20" />
                <h2 className="font-poppins text-4xl font-extrabold text-blue-600 text-center mb-8 -translate-y-10">
                    Login
                </h2>

                {!forgotMode ? (
                    <>
                        <div className="mb-4">
                            <label className="sr-only" htmlFor="email"></label>
                            <input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                className="w-80 max-w-full border border-black px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>
                        <div className="relative mb-6">
                            <label className="sr-only" htmlFor="password">Password</label>
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                placeholder="Enter your password"
                                className="w-80 max-w-full border border-black px-4 py-2 pr-12 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                            {password.length > 0 && (
                                <button
                                    type="button"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    <i className={showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'}></i>
                                </button>
                            )}
                        </div>
                        <button
                            className="w-80 max-w-full rounded-xl bg-blue-600 py-2.5 text-white transition hover:bg-blue-700"
                            onClick={() => navigate('/dashboard')}
                        >
                            Login
                        </button>
                        <button
                            className="text-sm text-blue-600 hover:text-blue-800 transition mt-4"
                            onClick={() => setForgotMode(true)}
                        >
                            Forgot password?
                        </button>
                        <button
                            onClick={() => navigate("/")}
                            className="mt-4 flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-2 px-15 bg-white hover:bg-gray-100 transition"
                        >
                            <FcGoogle size={22} />
                            <span className="font-medium text-gray-700">
                                Continue with Google
                            </span>
                        </button>
                        <button
                            className="text-blue-600 hover:text-blue-800 transition justify-center items-center mt-4 flex gap-2 pl-2"
                            onClick={() => navigate('/signup')}
                        >
                            Don't have an account? Sign up
                        </button>
                    </>
                ) : (
                    <>
                        <div className="mb-4">
                            <label className="sr-only" htmlFor="resetEmail">Email</label>
                            <input
                                id="resetEmail"
                                type="email"
                                value={resetEmail}
                                onChange={(event) => setResetEmail(event.target.value)}
                                placeholder="Enter your email"
                                className="w-80 max-w-full border border-black px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="sr-only" htmlFor="newPassword">New Password</label>
                            <input
                                id="newPassword"
                                type="password"
                                value={newPassword}
                                onChange={(event) => setNewPassword(event.target.value)}
                                placeholder="Enter new password"
                                className="w-80 max-w-full border border-black px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>
                        <div className="mb-6">
                            <label className="sr-only" htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(event) => setConfirmPassword(event.target.value)}
                                placeholder="Confirm new password"
                                className="w-80 max-w-full border border-black px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>
                        <button
                            className="w-80 max-w-full rounded-xl bg-blue-600 py-2.5 text-white transition hover:bg-blue-700 mb-5"
                            onClick={() => {
                                setForgotMode(false)
                                setResetEmail('')
                                setNewPassword('')
                                setConfirmPassword('')
                            }}
                        >
                            Reset Password
                        </button>
                        <button
                            className="w-80 max-w-full rounded-xl bg-blue-600 py-2.5 text-white transition hover:bg-blue-700"
                            onClick={() => setForgotMode(false)}
                        >
                            Back to login
                        </button>
                    </>
                )}
                </div>
            </div>
        
    )
}
export default Login