import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form"
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
    const [message, setMessage] = useState("")
    const { loginUser, signInWithGoogle} = useAuth();
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    // Forgot password modal state
    const [showForgot, setShowForgot] = useState(false);
    const [forgotEmail, setForgotEmail] = useState("");
    const [forgotMsg, setForgotMsg] = useState("");

    const onSubmit = async (data) => {
        try {
            await loginUser(data.email, data.password);
            toast.success(`Logged in as ${data.email}`);
            navigate("/")
        } catch (error) {
            setMessage("Please provide a valid email and password") 
            console.error(error)
        }
    }

    // Forgot password logic
    const handleForgotPassword = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: forgotEmail }),
            });
            const data = await res.json();
            setForgotMsg(data.message || 'If this email exists, a reset link has been sent.');
        } catch (err) {
            setForgotMsg('Error sending reset link.');
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithGoogle();
            toast.success(`Logged in as ${result.user.displayName || result.user.email}`);
            navigate("/");
        } catch (error) {
            setMessage("Google sign-in failed");
            console.error(error);
        }
    };

    return (
        <div className='min-h-[calc(100vh-120px)] flex justify-center items-center bg-gray-50 dark:bg-gray-900'>
            <div className='w-full max-w-md mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden'>
                <div className='px-8 pt-8 pb-6'>
                    <h2 className='text-2xl font-bold text-center text-gray-900 dark:text-white mb-8'>Welcome Back</h2>

                    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2' htmlFor="email">
                                Email Address
                            </label>
                            <input 
                                {...register("email", { required: true })} 
                                type="email" 
                                id="email" 
                                placeholder='Enter your email'
                                className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors'
                            />
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2' htmlFor="password">
                                Password
                            </label>
                            <input 
                                {...register("password", { required: true })} 
                                type="password" 
                                id="password" 
                                placeholder='Enter your password'
                                className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors'
                            />
                        </div>
                        {message && (
                            <p className='text-red-500 text-sm'>{message}</p>
                        )}
                        <div className="flex items-center justify-between">
                            <button 
                                type="button" 
                                onClick={() => setShowForgot(true)}
                                className="text-sm text-green-600 dark:text-green-400 hover:underline"
                            >
                                Forgot password?
                            </button>
                        </div>
                        <button 
                            type="submit"
                            className='w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200'
                        >
                            Sign In
                        </button>
                    </form>

                    <div className='mt-6'>
                        <div className='relative'>
                            <div className='absolute inset-0 flex items-center'>
                                <div className='w-full border-t border-gray-300 dark:border-gray-600'></div>
                            </div>
                            <div className='relative flex justify-center text-sm'>
                                <span className='px-2 bg-white dark:bg-gray-800 text-gray-500'>Or continue with</span>
                            </div>
                        </div>

                        <button 
                            onClick={handleGoogleLogin}
                            className='mt-4 w-full flex items-center justify-center gap-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200'
                        >
                            <FaGoogle className='text-red-500' />
                            <span>Sign in with Google</span>
                        </button>
                    </div>

                    <p className='mt-6 text-center text-sm text-gray-600 dark:text-gray-400'>
                        Don't have an account?{' '}
                        <Link to="/register" className='text-green-600 dark:text-green-400 hover:underline font-medium'>
                            Sign up
                        </Link>
                    </p>
                </div>

                {/* Forgot Password Modal */}
                {showForgot && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md mx-4">
                            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Reset Password</h3>
                            <form onSubmit={handleForgotPassword} className="space-y-4">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={forgotEmail}
                                    onChange={e => setForgotEmail(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                />
                                <div className="flex gap-4">
                                    <button 
                                        type="submit" 
                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors"
                                    >
                                        Send Reset Link
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => setShowForgot(false)}
                                        className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                                {forgotMsg && (
                                    <div className="text-sm text-green-600 dark:text-green-400 mt-2">
                                        {forgotMsg}
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Login