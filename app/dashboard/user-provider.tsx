"use client";

import { userContext } from "@/app/dashboard/user-context";
import { User } from "@supabase/supabase-js";

export default function UserProvider({
                                         user,
                                         children,
                                     }: {
    user: User | null;
    children: React.ReactNode;
}) {
    return (
        <userContext.Provider value={{ user, updateUser: async () => {} }}>
            {children}
        </userContext.Provider>
    );
}