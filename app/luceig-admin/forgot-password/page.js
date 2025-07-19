"use client";
import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const ForgotPasswordPage = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [email, setEmail] = useState('');
    const [isHovered, setIsHovered] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate form submission
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    {/* Success Message */}
                    <div className="text-center">
                        <div className="mx-auto w-16 h-16 bg-greenColor rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-greenColor text-3xl font-bold mb-2">
                            Check Your Email
                        </h2>
                        <p className="text-black/70 text-lg mb-4">
                            We&#39;ve sent a password reset link to
                        </p>
                        <p className="text-mainColor font-semibold text-lg mb-6">
                            {email}
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <div className="text-center space-y-4">
                            <p className="text-black/70 text-base leading-relaxed">
                                If you don&#39;t see the email in your inbox, please check your spam folder.
                                The link will expire in 24 hours for security reasons.
                            </p>

                            <div className="pt-4">
                                <Link
                                    href="/login"
                                    className="inline-flex items-center justify-center w-full py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-mainColor hover:bg-greenColor focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainColor transition-all duration-300 transform hover:scale-105"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to Login
                                </Link>
                            </div>

                            <div className="pt-2">
                                <button
                                    onClick={() => setIsSubmitted(false)}
                                    className="text-sm text-greenColor hover:text-mainColor transition-colors duration-300"
                                >
                                    Didn&#39;t receive the email? Try again
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h2 className="text-greenColor text-4xl font-bold mb-2">
                        Forgot Password?
                    </h2>
                    <p className="text-black/70 text-lg">
                        No worries, we&#39;ll send you reset instructions
                    </p>
                </div>

                {/* Forgot Password Form */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-transparent transition-all duration-300"
                                    placeholder="Enter your email address"
                                />
                            </div>
                            <p className="mt-2 text-sm text-gray-500">
                                Enter the email address associated with your account
                            </p>
                        </div>

                        {/* Reset Password Button */}
                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-mainColor hover:bg-greenColor focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainColor transition-all duration-300 transform hover:scale-105"
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                            >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <Mail className={`h-5 w-5 transition-transform duration-300 ${isHovered ? 'rotate-12' : ''}`} />
                </span>
                                Reset Password
                            </button>
                        </div>
                    </form>

                    {/* Back to Login Link */}
                    <div className="mt-6 text-center">
                        <Link
                            href="/login"
                            className="inline-flex items-center text-sm font-medium text-greenColor hover:text-mainColor transition-colors duration-300"
                        >
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Back to Login
                        </Link>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default ForgotPasswordPage;