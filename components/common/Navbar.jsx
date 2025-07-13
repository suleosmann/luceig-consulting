"use client";
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Logo from '@/public/assets/logo.svg';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const navItems = [
        { name: 'Home', href: '/' },
        { name: 'About us', href: '/about' },
        { name: 'Services', href: '/services' },
        { name: 'Testimonials', href: '/testimonials' },
        { name: 'Blog', href: '/blog' },
        { name: 'Careers', href: '/careers' },
        { name: 'Contact us', href: '/contact' }
    ];

    const isActive = (href) => {
        if (href === '/') {
            return pathname === '/';
        }
        return pathname.startsWith(href);
    };

    return (
        <nav className="sticky top-0 z-50 w-full bg-[#EFEFEF] transition-all duration-300 mt-2">
            <div className="w-full px-8 md:px-16 lg:px-24">
                <div className="flex items-center justify-between h-24 md:h-28">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Image
                            src={Logo}
                            alt="Handsel Logo"
                            width={90}
                            height={90}
                            className="h-12 md:h-[90px] w-auto"
                        />
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
                        {navItems.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className={`font-satoshi text-base lg:text-lg font-medium transition-colors duration-200 relative py-2 ${
                                    isActive(item.href)
                                        ? 'text-gray-400 -translate-y-0.5'
                                        : 'text-black hover:text-gray-600'
                                }`}
                            >
                                {item.name}
                                {isActive(item.href) && (
                                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gray-400 rounded-full"></div>
                                )}
                            </a>
                        ))}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMenu}
                        className="md:hidden flex items-center justify-center w-12 h-12 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                        aria-label="Toggle menu"
                    >
                        <svg
                            className={`w-6 h-6 text-gray-700 transform transition-transform duration-200 ${
                                isMenuOpen ? 'rotate-90' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {isMenuOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Navigation */}
                <div
                    className={`md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg transition-all duration-300 overflow-hidden ${
                        isMenuOpen
                            ? 'opacity-100 visible max-h-[500px]'
                            : 'opacity-0 invisible max-h-0'
                    }`}
                >
                    <div className="flex flex-col p-4">
                        {navItems.map((item, index) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className={`font-satoshi text-sm font-medium transition-all duration-200 py-3 px-4 rounded-lg relative ${
                                    isActive(item.href)
                                        ? 'text-gray-900 bg-gray-100'
                                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                                onClick={() => setIsMenuOpen(false)}
                                style={{
                                    animationDelay: `${index * 0.1}s`
                                }}
                            >
                                {item.name}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;