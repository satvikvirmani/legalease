"use client"

import { userContext } from "@/app/dashboard/user-context";
import { useContext } from "react";
import ClientHome from "@/app/dashboard/client-home/client-home";
import ProviderHome from "@/app/dashboard/provider-home/provider-home";

export default function Home() {
    const user = useContext(userContext);

    if(!user) {return <div>Loading...</div>}

    return (
        <main>
            {
                user.user_metadata.role == "client" ? <ClientHome /> : <ProviderHome user={user} />
            }
        </main>
    )
}