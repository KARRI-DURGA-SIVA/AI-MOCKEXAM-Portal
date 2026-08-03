import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { FcGoogle } from 'react-icons/fc'

function Signup() {
    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)

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

                  <div className="relative w-80 mb-8">
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
                    <div className="relative w-80 mb-8">
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
                <button
                    onClick={() => navigate('/')}
                    className="w-80 max-w-full mt-4 flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-2 bg-white hover:bg-gray-100 transition"
                >
                    <FcGoogle size={22} />
                    <span className="font-medium text-gray-700">Continue with Google</span>
                </button>
                <button
                    className="text-blue-600 hover:text-blue-800 transition justify-center items-center mt-4 flex gap-2"
                    onClick={() => navigate('/login')}
                >
                    Already have an account? Login
                </button>
            </div>
        </div>
    )
}
export default Signup;