import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { signInWithPopup } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth, provider } from '../firebase';
import { loginUser } from '../services/auth';

function Login() {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [forgotMode, setForgotMode] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;

        if (showToast) {
            timeout = setTimeout(() => setShowToast(false), 2200);
        }

        return () => clearTimeout(timeout);
    }, [showToast]);

    const loginSuccess = () => {
        setShowToast(true);

        setTimeout(() => {
            navigate('/dashboard');
        }, 1000);
    };

    const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setLoading(true);
        setErrorMessage('');

        try {
            await loginUser({
                email: email.trim(),
                password,
            });

            loginSuccess();
        } catch (error: unknown) {
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : 'Login failed. Please check your credentials.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);

            console.log('Google login successful:', result.user);

            loginSuccess();
        } catch (error: unknown) {
            console.error('Google login error:', error);

            const message =
                error instanceof FirebaseError
                    ? `${error.code}: ${error.message}`
                    : error instanceof Error
                        ? error.message
                        : String(error);

            alert(`Google sign-in failed: ${message}`);
        }
    };

    return (
        <div className="min-h-screen bg-white flex relative">
            <div className="w-5/3 bg-blue-600 flex flex-col items-center justify-center p-8">
                <h1 className="text-5xl text-white font-extrabold">
                    AI EXAM PORTAL
                </h1>

                <p className="mt-4 text-white text-xl">
                    Welcome Back
                </p>
            </div>

            <div className="w-5/4 flex flex-col items-center justify-center p-8">
                <img
                    src="src/assets/3u.png"
                    alt="Login"
                    className="w-15 -translate-y-20"
                />

                <h2 className="font-poppins text-4xl font-extrabold text-blue-600 text-center mb-8 -translate-y-10">
                    Login
                </h2>

                {!forgotMode ? (
                    <>
                        <form
                            onSubmit={handleLogin}
                            className="flex flex-col items-center"
                        >
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
                                    autoComplete="email"
                                    required
                                    className="w-full border border-gray-600 px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div className="relative w-80 mb-8 mt-1">
                                <label
                                    htmlFor="password"
                                    className="absolute -top-6 left-0 text-sm font-medium text-gray-700"
                                >
                                    Password
                                </label>

                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    required
                                    className="w-full border border-gray-600 px-4 py-2 pr-12 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />

                                {password.length > 0 && (
                                    <button
                                        type="button"
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={
                                            showPassword
                                                ? 'Hide password'
                                                : 'Show password'
                                        }
                                    >
                                        <i
                                            className={
                                                showPassword
                                                    ? 'bi bi-eye-slash'
                                                    : 'bi bi-eye'
                                            }
                                        />
                                    </button>
                                )}
                            </div>

                            <div className="w-80 flex justify-end mb-4 -ml-61">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-3 h-3 accent-blue-600 focus:ring-blue-500"
                                    />

                                    <span className="ml-3 text-sm text-gray-700">
                                        Remember me for 30 days
                                    </span>
                                </label>
                            </div>

                            {errorMessage && (
                                <p
                                    className="w-80 mb-4 text-sm text-red-600"
                                    role="alert"
                                >
                                    {errorMessage}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-80 rounded-xl bg-blue-600 py-2.5 text-white hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                        </form>

                        {showToast && (
                            <div className="fixed left-1/2 top-6 z-50 -translate-x-1/2">
                                <div
                                    className="overflow-hidden rounded-full bg-white shadow-[0_20px_60px_rgba(45,85,255,0.12)] ring-1 ring-slate-200"
                                    style={{
                                        minWidth: '320px',
                                        maxWidth: '320px',
                                    }}
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

                                        <p className="ml-5 mt-2 text-base font-semibold text-slate-900">
                                            Login Successfully
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <button
                            type="button"
                            className="text-sm text-blue-600 hover:text-blue-800 mt-4"
                            onClick={() => {
                                setErrorMessage('');
                                setForgotMode(true);
                            }}
                        >
                            Forgot Password?
                        </button>

                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            className="mt-4 w-80 flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-2 hover:bg-gray-100 transition"
                        >
                            <FcGoogle size={22} />
                            <span className="font-medium text-gray-700">
                                Continue with Google
                            </span>
                        </button>

                        <div className="mt-4 flex items-center justify-center text-sm">
                            <span className="text-gray-700">
                                Don't have an account?
                            </span>

                            <button
                                type="button"
                                onClick={() => navigate('/signup')}
                                className="ml-2 text-blue-600 font-medium hover:text-blue-800 hover:underline"
                            >
                                Sign Up
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="mb-8 w-80">
                            <label
                                htmlFor="resetEmail"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Email
                            </label>

                            <input
                                id="resetEmail"
                                type="email"
                                value={resetEmail}
                                onChange={(event) => setResetEmail(event.target.value)}
                                placeholder="Enter your email"
                                className="w-full border border-gray-600 px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <div className="relative w-80 mb-8">
                            <label
                                htmlFor="newPassword"
                                className="absolute -top-6 left-0 text-sm font-medium text-gray-700"
                            >
                                New Password
                            </label>

                            <input
                                id="newPassword"
                                type={showPassword ? 'text' : 'password'}
                                value={newPassword}
                                onChange={(event) => setNewPassword(event.target.value)}
                                placeholder="Enter New password"
                                className="w-full border border-gray-600 px-4 py-2 pr-12 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />

                            {newPassword.length > 0 && (
                                <button
                                    type="button"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={
                                        showPassword
                                            ? 'Hide password'
                                            : 'Show password'
                                    }
                                >
                                    <i
                                        className={
                                            showPassword
                                                ? 'bi bi-eye-slash'
                                                : 'bi bi-eye'
                                        }
                                    />
                                </button>
                            )}
                        </div>

                        <div className="relative w-80 mb-8">
                            <label
                                htmlFor="confirmPassword"
                                className="absolute -top-6 left-0 text-sm font-medium text-gray-700"
                            >
                                Confirm Password
                            </label>

                            <input
                                id="confirmPassword"
                                type={showPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(event) => setConfirmPassword(event.target.value)}
                                placeholder="Confirm new password"
                                className="w-full border border-gray-600 px-4 py-2 pr-12 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />

                            {confirmPassword.length > 0 && (
                                <button
                                    type="button"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={
                                        showPassword
                                            ? 'Hide password'
                                            : 'Show password'
                                    }
                                >
                                    <i
                                        className={
                                            showPassword
                                                ? 'bi bi-eye-slash'
                                                : 'bi bi-eye'
                                        }
                                    />
                                </button>
                            )}
                        </div>

                        {errorMessage && (
                            <p className="w-80 mb-4 text-sm text-red-600" role="alert">
                                {errorMessage}
                            </p>
                        )}

                        <button
                            type="button"
                            className="w-80 max-w-full rounded-xl bg-blue-600 py-2.5 text-white transition hover:bg-blue-700 mb-5"
                            onClick={() => {
                                if (!resetEmail.trim()) {
                                    setErrorMessage('Please enter your email address.');
                                    return;
                                }

                                if (newPassword.length < 8) {
                                    setErrorMessage(
                                        'Your new password must contain at least 8 characters.'
                                    );
                                    return;
                                }

                                if (newPassword !== confirmPassword) {
                                    setErrorMessage('Passwords do not match.');
                                    return;
                                }

                                setErrorMessage(
                                    'Password reset is not connected yet. Please use your configured password-reset service.'
                                );
                            }}
                        >
                            Reset Password
                        </button>

                        <button
                            type="button"
                            className="w-80 max-w-full rounded-xl bg-blue-600 py-2.5 text-white transition hover:bg-blue-700"
                            onClick={() => {
                                setForgotMode(false);
                                setErrorMessage('');
                                setResetEmail('');
                                setNewPassword('');
                                setConfirmPassword('');
                            }}
                        >
                            Back to login
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default Login;
