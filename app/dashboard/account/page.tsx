import { createClient } from '@/app/utils/supabase/server'

import { Noto_Serif } from 'next/font/google'
import Username from '@/app/dashboard/account/username'
import AddressDetails from '@/app/dashboard/account/address-details'
import ProviderDetails from '@/app/dashboard/account/provider-details'
import { Divider } from "@heroui/react";
import BasicDetails from '@/app/dashboard/account/basic-details'

const NotoSerif = Noto_Serif({
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    subsets: ["latin"]
})

export default async function Home() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser()

    return (
        <main className='p-16'>
            <h1 className={`mb-6 text-2xl font-light ${NotoSerif.className}`}>Complete your profile to get started</h1>
            <Divider className="my-4" />
            {
                user?.user_metadata.role == 'provider' && (
                    <>
                        <Username user={user} />
                        <Divider className="my-4" />
                    </>
                )
            }
            <BasicDetails user={user} />
            <Divider className="my-4" />
            <AddressDetails user={user} />
            <Divider className="my-4" />
            {
                user?.user_metadata.role == 'provider' && (
                    <>
                        <ProviderDetails user={user} />
                    </>
                )
            }
        </main>
    )
}