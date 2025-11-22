"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

export default function ThemeInit() {
    const { setTheme } = useTheme();

    useEffect(() => {
        const prefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;
        setTheme(prefersDark ? "dark" : "light");
    }, [setTheme]);

    return null;
}
