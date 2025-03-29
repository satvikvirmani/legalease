import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
    title: "LegalEase - Manage Account",
};

export default function HomeLayout({ children }: { children: ReactNode }) {
    return (
        <main>
            {children}
        </main>
    );
}