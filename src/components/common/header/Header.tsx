"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styles from "./Header.module.css";

export default function Header() {
    const [expanded, setExpanded] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const toggleMenu = () => setExpanded(!expanded);

    // All pages
    const pages: { path: string; label: string }[] = [
        { path: "/", label: "Home" },
        { path: "/calendar", label: "Calendar" },
        { path: "/our-timeline", label: "Our Timeline" },
        { path: "/movie-list", label: "Movie List" },
        { path: "/music-playlists", label: "Music Playlists" },
        { path: "/letter-box", label: "Letter Box" },
        { path: "/bucketlist", label: "Bucketlist" },
        { path: "/date-ideas-list", label: "Date Ideas List" },
        { path: "/random-decider", label: "Spinwheel / RPS" },
    ];

    // Current page
    const currentPage = pages.find((p) => p.path === pathname) || pages[0];

    // Other pages for the expanded menu
    const otherPages = pages.filter((p) => p.path !== currentPage.path);

    // Handle navigation and collapse
    const handleNavigate = (path: string) => {
        router.push(path);
        setExpanded(false);
    };

    return (
        <header className={styles.header}>
            <div className={styles.topRow}>
                <div className={styles.navigator}>
                    <button className={styles.navButton} onClick={toggleMenu}>
                        {currentPage.label}
                    </button>
                </div>

                <Link href="/" className={styles.title}>
                    <p>Raifi&apos;s Space</p>
                </Link>
            </div>

            {expanded && (
                <div className={styles.expandedMenu}>
                    {otherPages.map((page) => (
                        <button
                            key={page.path}
                            onClick={() => handleNavigate(page.path)}
                            className={styles.menuButton}
                        >
                            {page.label}
                        </button>
                    ))}
                </div>
            )}
        </header>
    );
}
