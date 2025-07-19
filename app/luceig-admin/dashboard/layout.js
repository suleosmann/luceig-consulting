// app/luceig-admin/dashboard/layout.js
"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import useAuthStore from '@/stores/authStore';
import {
    LayoutDashboard,
    Briefcase,
    FileText,
    Users,
    User,
    Menu,
    X,
    LogOut,
    Bell,
    ChevronDown,
    BriefcaseBusinessIcon
} from 'lucide-react';

const Layout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false);
    const dropdownRef = useRef(null);
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout, isAuthenticated, isLoading } = useAuthStore();

    // Handle hydration
    useEffect(() => {
        setIsHydrated(true);
    }, []);

    // Check authentication after hydration
    useEffect(() => {
        if (isHydrated && !isLoading && !isAuthenticated) {
            router.push('/luceig-admin/login');
        }
    }, [isHydrated, isAuthenticated, isLoading, router]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const navigation = [
        { name: 'Dashboard', href: '/luceig-admin/dashboard', icon: LayoutDashboard },
        {name: 'Company', href: '/luceig-admin/dashboard/company', icon: BriefcaseBusinessIcon},
        { name: 'Jobs', href: '/luceig-admin/dashboard/jobs', icon: Briefcase },
        { name: 'Applications', href: '/luceig-admin/dashboard/applications', icon: FileText },
        { name: 'Candidates', href: '/luceig-admin/dashboard/candidates', icon: Users },
        { name: 'Users', href: '/luceig-admin/dashboard/users', icon: User },
    ];

    const handleLogout = () => {
        logout();
    };

    const handleProfileClick = () => {
        router.push('/luceig-admin/dashboard/profile');
        setIsDropdownOpen(false);
    };

    // Show loading while hydrating or checking authentication
    if (!isHydrated || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-mainColor"></div>
            </div>
        );
    }

    // If not authenticated after hydration, don't render anything (will redirect)
    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="h-screen flex overflow-hidden bg-gray-100">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 flex z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                >
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
                    <div className="relative flex-1 flex flex-col max-w-xs w-full bg-mainColor">
                        <div className="absolute top-0 right-0 -mr-12 pt-2">
                            <button
                                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                onClick={() => setSidebarOpen(false)}
                            >
                                <X className="h-6 w-6 text-white" />
                            </button>
                        </div>
                        <SidebarContent navigation={navigation} pathname={pathname} onLogout={handleLogout} />
                    </div>
                </div>
            )}

            {/* Desktop sidebar */}
            <div className="hidden md:flex md:flex-shrink-0">
                <div className="flex flex-col w-64">
                    <SidebarContent navigation={navigation} pathname={pathname} onLogout={handleLogout} />
                </div>
            </div>

            {/* Main content */}
            <div className="flex flex-col w-0 flex-1 overflow-hidden">
                {/* Top navigation */}
                <div className="relative z-10 flex-shrink-0 flex h-16 bg-mainColor shadow">
                    <button
                        className="px-4 border-r border-gray-200 text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white md:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="h-6 w-6" />
                    </button>

                    <div className="flex-1 px-4 flex justify-between items-center">
                        {/* Empty left side or you can add a title here */}
                        <div></div>

                        {/* Right side with notifications and user dropdown */}
                        <div className="flex items-center space-x-4">
                            {/* Notifications */}
                            <button className="bg-mainColor p-1 rounded-full text-white hover:bg-white hover:text-mainColor focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white">
                                <Bell className="h-6 w-6" />
                            </button>

                            {/* User Dropdown */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="group flex items-center space-x-3 hover:bg-white hover:text-mainColor rounded-lg px-3 py-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                                >
                                    {/* User Avatar */}
                                    <div className="h-8 w-8 rounded-full bg-mainColor group-hover:bg-mainColor flex items-center justify-center">
                      <span className="text-sm font-medium text-white group-hover:text-white">
                        {user?.firstName?.charAt(0) || 'U'}
                      </span>
                                    </div>

                                    {/* User Info */}
                                    <div className="hidden md:block text-left">
                                        <div className="text-sm font-medium text-white group-hover:text-mainColor transition-colors duration-200">
                                            {user?.firstName} {user?.lastName}
                                        </div>
                                        <div className="text-xs text-gray-200 group-hover:text-mainColor group-hover:opacity-80 transition-colors duration-200">{user?.email}</div>
                                    </div>

                                    {/* Dropdown Arrow */}
                                    <ChevronDown
                                        className={`h-4 w-4 text-white group-hover:text-mainColor transition-transform duration-200 ${
                                            isDropdownOpen ? 'rotate-180' : ''
                                        }`}
                                    />
                                </button>

                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                                        <div className="py-1" role="menu">
                                            {/* User Info in Mobile */}
                                            <div className="md:hidden px-4 py-3 border-b border-gray-100">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {user?.firstName} {user?.lastName}
                                                </div>
                                                <div className="text-sm text-gray-500">{user?.email}</div>
                                                <div className="text-xs text-gray-400">
                                                    {user?.roles?.join(', ') || 'User'}
                                                </div>
                                            </div>

                                            {/* Account/Profile Option */}
                                            <button
                                                onClick={handleProfileClick}
                                                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                                role="menuitem"
                                            >
                                                <User className="h-4 w-4 mr-3 text-gray-400" />
                                                Account Settings
                                            </button>

                                            {/* Divider */}
                                            <hr className="border-gray-100" />

                                            {/* Logout Option */}
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center w-full px-4 py-3 text-sm text-red-700 hover:bg-red-50 transition-colors duration-200"
                                                role="menuitem"
                                            >
                                                <LogOut className="h-4 w-4 mr-3 text-red-500" />
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page content */}
                <main className="flex-1 relative overflow-y-auto focus:outline-none">
                    <div className="py-6">
                        <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

// Sidebar Content Component
const SidebarContent = ({ navigation, pathname, onLogout }) => {
    return (
        <div className="flex flex-col h-0 flex-1 bg-mainColor">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                <div className="flex items-center flex-shrink-0 px-4">
                    <h1 className="text-2xl font-bold text-white hover:text-mainColor">Luceig Consulting</h1>
                </div>

                <nav className="mt-8 flex-1 px-2 space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`
                  group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200
                  ${isActive
                                    ? 'bg-white text-mainColor'
                                    : 'text-white hover:bg-white hover:bg-opacity-20 hover:text-mainColor'
                                }
                `}
                            >
                                <item.icon
                                    className={`
                    mr-3 flex-shrink-0 h-6 w-6
                    ${isActive ? 'text-mainColor' : 'text-white group-hover:text-mainColor'}
                  `}
                                />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
};

export default Layout;