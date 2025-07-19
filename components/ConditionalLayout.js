// components/ConditionalLayout.jsx
"use client";
import { usePathname } from 'next/navigation';
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

export default function ConditionalLayout({ children }) {
    const pathname = usePathname();

    // Check if current route should exclude navbar and footer
    const shouldHideNavFooter = pathname.startsWith('/luceig-admin')

    return (
        <>
            {!shouldHideNavFooter && <Navbar />}
            <main>{children}</main>
            {!shouldHideNavFooter && <Footer />}
        </>
    );
}