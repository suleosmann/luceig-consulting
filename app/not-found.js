import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Home, Search, Mail, Phone } from 'lucide-react';

export default function Custom404() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full text-center">
                {/* Logo/Brand Section */}
                <div className="mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-2xl mb-6 shadow-lg">
                        <span className="text-2xl font-bold text-white">LC</span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">Lucieg Consulting</h1>
                    <p className="text-slate-600">Professional Business Solutions</p>
                </div>

                {/* 404 Error Section */}
                <div className="mb-12">
                    <div className="text-8xl font-bold text-indigo-600 mb-4 opacity-20">404</div>
                    <h2 className="text-4xl font-bold text-slate-800 mb-4">Page Not Found</h2>
                    <p className="text-xl text-slate-600 mb-8 max-w-md mx-auto">
                        The page you're looking for seems to have taken an unexpected detour.
                        Let's get you back on track.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                    <Link href="/" className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-semibold shadow-lg hover:shadow-xl">
                        <Home className="w-5 h-5 mr-2" />
                        Back to Home
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center justify-center px-6 py-3 bg-white text-slate-700 border-2 border-slate-200 rounded-lg hover:border-indigo-300 hover:bg-slate-50 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Go Back
                    </button>

                    <Link href="/search" className="inline-flex items-center justify-center px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors duration-200 font-semibold shadow-lg hover:shadow-xl">
                        <Search className="w-5 h-5 mr-2" />
                        Search Site
                    </Link>
                </div>

                {/* Quick Links */}
                <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
                    <h3 className="text-xl font-semibold text-slate-800 mb-6">Quick Links</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Link href="/services" className="p-4 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200 group">
                            <div className="font-semibold text-slate-700 group-hover:text-indigo-600">Services</div>
                            <div className="text-sm text-slate-500 mt-1">Our Solutions</div>
                        </Link>

                        <Link href="/about" className="p-4 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200 group">
                            <div className="font-semibold text-slate-700 group-hover:text-indigo-600">About Us</div>
                            <div className="text-sm text-slate-500 mt-1">Our Story</div>
                        </Link>

                        <Link href="/contact" className="p-4 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200 group">
                            <div className="font-semibold text-slate-700 group-hover:text-indigo-600">Contact</div>
                            <div className="text-sm text-slate-500 mt-1">Get In Touch</div>
                        </Link>

                        <Link href="/careers" className="p-4 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200 group">
                            <div className="font-semibold text-slate-700 group-hover:text-indigo-600">Careers</div>
                            <div className="text-sm text-slate-500 mt-1">Join Our Team</div>
                        </Link>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-slate-600">
                    <div className="flex items-center">
                        <Mail className="w-5 h-5 mr-2 text-indigo-600" />
                        <span>info@luciegconsulting.com</span>
                    </div>
                    <div className="flex items-center">
                        <Phone className="w-5 h-5 mr-2 text-indigo-600" />
                        <span>+1 (555) 123-4567</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-12 text-sm text-slate-500">
                    © 2025 Lucieg Consulting. All rights reserved.
                </div>
            </div>
        </div>
    );
}