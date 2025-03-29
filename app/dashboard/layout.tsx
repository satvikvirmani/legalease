import { createClient } from "@/app/utils/supabase/server";
import SideMenu from "@/app/dashboard/sidemenu";
import UserProvider from "@/app/dashboard/user-provider";
import { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "LegalEase - Dashboard",
};

export default async function HomeLayout({ children }: { children: ReactNode }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <UserProvider user={user}>
            <main className="flex flex-row">
                <SideMenu />
                <main className="w-full h-screen overflow-y-scroll">{children}</main>
            </main>
        </UserProvider>
    );
}