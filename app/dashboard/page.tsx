"use client";

import { userContext } from "@/app/dashboard/user-context";
import { useContext } from "react";
import ClientHome from "@/app/dashboard/client-home/client-home";
import ProviderHome from "@/app/dashboard/provider-home/provider-home";

export default function Home() {
    const { user } = useContext(userContext);

    if (!user) return <div>Loading...</div>;

    const profileComplete = user.user_metadata.profile_complete || {};

    const isClientComplete = profileComplete.username && profileComplete.basic && profileComplete.address;
    const isProviderComplete = isClientComplete && profileComplete.provider;

    return (
        <main className="w-full min-h-screen">
            {isProviderComplete ? (
                <ProviderHome user={user} />
            ) : isClientComplete ? (
                <ClientHome />
            ) : (
                <div>Please complete your profile</div>
            )}
        </main>
    );
}