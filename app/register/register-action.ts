'use server'

import { createClient } from '@/app/utils/supabase/server'

export async function signup(formdata: FormData) {

  const supabase = await createClient()
  const data = {
    email: formdata.get('email') as string,
    password: formdata.get('password') as string,
    options: {
      data: {
        role: formdata.get('role') as string,
        profile_complete: false,
        avatar_url: null,
      },
    },
  }
  
  const { error } = await supabase.auth.signUp(data)

  if (error) {
    return { error: error.message };
  }

  return { success: true, redirectTo: "/dashboard" };
}