import { createClient } from '@/app/utils/supabase/server'
import ClientRequests from "./client";
import ProviderRequests from "./provider";

export default async function Page() {
    const supabase = await createClient();
    
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if(!user) {return <div>Loading...</div>}

    console.log(user);

    return (
        <>
        <main className="w-full min-h-screen p-8">
        {user.user_metadata.role == "client" ? 
            <ClientRequests user={user} />: <ProviderRequests user={user} />}
        </main>
        </>
    );
}