import { Geist, Geist_Mono } from "next/font/google";
import localFont from 'next/font/local';
import "./globals.css";
import ConditionalLayout from "@/components/ConditionalLayout";
import AuthProvider from "@/provider/AuthProvider";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const satoshi = localFont({
    src: [
        {
            path: './fonts/Satoshi-Light.otf',
            weight: '300',
            style: 'normal',
        },
        {
            path: './fonts/Satoshi-LightItalic.otf',
            weight: '300',
            style: 'italic',
        },
        {
            path: './fonts/Satoshi-Regular.otf',
            weight: '400',
            style: 'normal',
        },
        {
            path: './fonts/Satoshi-Italic.otf',
            weight: '400',
            style: 'italic',
        },
        {
            path: './fonts/Satoshi-Medium.otf',
            weight: '500',
            style: 'normal',
        },
        {
            path: './fonts/Satoshi-MediumItalic.otf',
            weight: '500',
            style: 'italic',
        },
        {
            path: './fonts/Satoshi-Bold.otf',
            weight: '700',
            style: 'normal',
        },
        {
            path: './fonts/Satoshi-BoldItalic.otf',
            weight: '700',
            style: 'italic',
        },
        {
            path: './fonts/Satoshi-Black.otf',
            weight: '900',
            style: 'normal',
        },
        {
            path: './fonts/Satoshi-BlackItalic.otf',
            weight: '900',
            style: 'italic',
        },
    ],
    variable: '--font-satoshi'
});

export const metadata = {
    title: "Lucieg Consulting - Strategic Recruitment Partnership",
    description: "Transform your business with the right talent. We're your strategic recruitment partner, dedicated to scaling your hiring needs and building impactful, lasting teams together.",
    icons: {
        icon: '/assets/logo.svg',
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <head>
            <link rel="icon" href="/assets/Favicon.svg" type="image/svg+xml" />
        </head>
        <body
            className={`${geistSans.variable} ${geistMono.variable} ${satoshi.variable} antialiased`}
        >
        <AuthProvider>
            <ConditionalLayout>{children}</ConditionalLayout>
        </AuthProvider>
        </body>
        </html>
    );
}