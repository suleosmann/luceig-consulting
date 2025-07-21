import Image from 'next/image';
import { FaInstagram, FaLinkedin, FaTwitter, FaFacebook } from 'react-icons/fa';
import Logo from '@/public/assets/hero-logo.svg';
import React from "react";

const Footer = () => {
    return (
        <footer className="bg-[#1A1A1A] text-white font-satoshi">
            {/* Main Footer Content */}
            <div className="px-8 sm:px-12 lg:px-16 xl:px-20 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Logo and Description Section */}
                    <div className="lg:col-span-1">
                        <div className="mb-8">
                            <Image
                                src={Logo}
                                alt="Lucieg Consulting Logo"
                                width={205}
                                height={200}
                                className="mb-6"
                            />
                        </div>
                    </div>

                    {/* Menu Section */}
                    <div className="lg:col-span-1">
                        <h3 className="text-white font-semibold mb-4 text-lg">
                            Menu
                            <div className="w-16 h-0.5 bg-white mt-2"></div>
                        </h3>
                        <ul className="space-y-3">
                            <li><a href="/" className="text-white/90 hover:text-white transition-colors">Home</a></li>
                            <li><a href="/about" className="text-white/90 hover:text-white transition-colors">About us</a></li>
                            <li><a href="/services" className="text-white/90 hover:text-white transition-colors">Services</a></li>
                            <li><a href="/testimonials" className="text-white/90 hover:text-white transition-colors">Testimonials</a></li>
                            <li><a href="/blog" className="text-white/90 hover:text-white transition-colors">Blog</a></li>
                            <li><a href="/careers" className="text-white/90 hover:text-white transition-colors">Careers</a></li>
                            <li><a href="/contact" className="text-white/90 hover:text-white transition-colors">Contact us</a></li>
                        </ul>
                    </div>

                    {/* Information Section */}
                    <div className="lg:col-span-1">
                        <h3 className="text-white font-semibold mb-4 text-lg">
                            Information
                            <div className="w-16 h-0.5 bg-white mt-2"></div>
                        </h3>
                        <ul className="space-y-3">
                            <li><a href="/legal-notice" className="text-white/90 hover:text-white transition-colors">Legal Notice</a></li>
                            <li><a href="/privacy-policy" className="text-white/90 hover:text-white transition-colors">Privacy policy</a></li>
                            <li><a href="/about-cookies" className="text-white/90 hover:text-white transition-colors">About cookies</a></li>
                        </ul>
                    </div>

                    {/* Contact Section */}
                    <div className="lg:col-span-1">
                        <h3 className="text-white font-semibold mb-4 text-lg">
                            Contact
                            <div className="w-16 h-0.5 bg-white mt-2"></div>
                        </h3>
                        <div className="space-y-3">
                            <p className="text-white/90">
                                <span className="font-semibold">C:</span> +44 204 5113 383
                            </p>
                            <p className="text-white/90">
                                <span className="font-semibold">E:</span> info@luciegconsulting.com
                            </p>
                            <p className="text-white/90">
                                <span className="font-semibold">W:</span> https://luciegconsulting.com
                            </p>
                        </div>
                    </div>

                    {/* Social Section */}
                    <div className="lg:col-span-1">
                        <h3 className="text-white font-semibold mb-4 text-lg">
                            Social
                            <div className="w-16 h-0.5 bg-white mt-2"></div>
                        </h3>
                        {/* Social Icons */}
                        <div className="flex space-x-4">
                            <a href="#" className="text-white transition-colors">
                                <FaInstagram size={24} />
                            </a>
                            <a href="#" className="text-white transition-colors">
                                <FaLinkedin size={24} />
                            </a>
                            <a href="#" className="text-white transition-colors">
                                <FaTwitter size={24} />
                            </a>
                            <a href="#" className="text-white transition-colors">
                                <FaFacebook size={24} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Copyright Section */}
            <div className="border-t border-white px-8 sm:px-12 lg:px-16 xl:px-20 py-6">
                <div className="text-left">
                    <p className="text-white/80 text-sm">
                        Copyright © 2025 Luciegconsulting.com * | All rights reserved
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;