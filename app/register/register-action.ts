'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/app/utils/supabase/server'

export async function signup(formdata: FormData) {

  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs

  const data = {
    email: formdata.get('email') as string,
    password: formdata.get('password') as string,
    options: {
      data: {
        role: formdata.get('role') as string,
        profile_complete: false
      },
    },
  }
  
  const { error } = await supabase.auth.signUp(data)

  if (error) {
    console.error("Registration error:", error);
    return { error: error.message };
  }

  return { success: true, redirectTo: "/dashboard" };
}