import type { Metadata } from "next";
import { Lora, Inter } from "next/font/google";

import Providers from './providers';
import HeaderLayout from "@/components/common/header/HeaderLayout";

import "./styles/globals.css"

const lora = Lora({
    variable: "--font-heading",
    subsets: ["latin"],
});

const inter = Inter({
    variable: "--font-body",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Raifi's Scrapbook",
    description: "Our website<3",
    icons: {
        icon: "/favicon.ico",
        shortcut: "#",
        apple: "#",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${lora.variable} ${inter.variable}`}>
                <Providers>
                    <HeaderLayout />
                        {children}
                </Providers>
            </body>
        </html>
    );
}
