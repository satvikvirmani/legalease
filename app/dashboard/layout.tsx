"use client"

import { createClient } from "@/app/utils/supabase/client";
import SideMenu from "@/app/dashboard/sidemenu";
import { userContext } from "@/app/dashboard/user-context";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

export default function HomeLayout({
    children,
}: {
    children: React.ReactNode
}) {

    const [user, setUser] = useState<User | null>(null);
    
    const supabase = createClient()
  
    const fetchUser = async () => {
      const { data: { user }, } = await supabase.auth.getUser();
  
      setUser(user);
    };
  
    useEffect(() => {
      fetchUser();
    }, [supabase]);

    if(!user) {return <div>Loading...</div>}
    console.log(user);

    return (
        <userContext.Provider value={user}>
            <main className="flex flex-row">
                <SideMenu user={user} />
                <main className="w-full h-screen overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
                    {children}
                </main>
            </main>
        </userContext.Provider>
    )
}