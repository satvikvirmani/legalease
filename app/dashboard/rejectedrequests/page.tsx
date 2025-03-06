import { createClient } from '@/app/utils/supabase/server'
import ClientRequests from "./client";
import ProivderRequests from "./provider";

export default async function Page() {
    const supabase = await createClient();
    
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if(!user) {return <div>Loading...</div>}

    console.log(user);

    return (
        <>
            {user.user_metadata.role == "client" ? 
            <ClientRequests user={user} />: <ProivderRequests user={user} />}
        </>
    );
}