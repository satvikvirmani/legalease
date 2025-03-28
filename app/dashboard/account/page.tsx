"use client";

import Username from "@/app/dashboard/account/username";
import BasicDetails from "@/app/dashboard/account/basic-details";
import AddressDetails from "@/app/dashboard/account/address-details";
import ProviderDetails from "@/app/dashboard/account/provider-details";
import {useContext} from "react";
import {Accordion, AccordionItem, Divider} from "@heroui/react";
import {userContext} from "@/app/dashboard/user-context";

export default function Home() {
    const {user} = useContext(userContext);

    console.log(user);

    if (!user) return <div>Loading...</div>;

    return (
        <section className="p-16">
            <h1 className="mb-6 text-2xl">Complete your profile to get started</h1>
            <Divider className="my-4"/>
            <Accordion>
                <AccordionItem key="1" aria-label="Username Details" title="Username Details">
                    <Username user={user}/>
                </AccordionItem>
                <AccordionItem key="2" aria-label="Basic Details" title="Basic Details">
                    <BasicDetails user={user}/>
                </AccordionItem>
                <AccordionItem key="3" aria-label="Address Details" title="Address Details">
                    <AddressDetails user={user}/>
                </AccordionItem>
                {user?.user_metadata.role === "provider" ? (
                    <AccordionItem key="4" aria-label="Provider Details" title="Provider Details">
                        <ProviderDetails user={user}/>
                    </AccordionItem>
                ) : null}
            </Accordion>
        </section>
    );
}