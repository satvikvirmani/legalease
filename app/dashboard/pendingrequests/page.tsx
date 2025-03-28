"use client";

import ClientRequests from "./client";
import ProviderRequests from "./provider";
import {useContext} from "react";
import {userContext} from "@/app/dashboard/user-context";

export default function Page() {
    const {user} = useContext(userContext);

    if (!user) return <div>Loading...</div>;

    return (
        <main className="w-full min-h-screen p-8">
        {user.user_metadata.role == "client" ? 
            <ClientRequests user={user} />: <ProviderRequests user={user} />}
        </main>
    );
}