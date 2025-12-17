'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        redirect('/login?error=Invalid credentials')
    }

    revalidatePath('/', 'layout')
    redirect('/profil')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const fullName = formData.get('fullName') as string
    const situation = formData.get('situation') as string

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
                situation: situation,
            }
        }
    })

    if (error) {
        redirect('/signup?error=Could not authenticate user')
    }

    // If email confirmation is disabled provided supabase settings, 
    // we can sync user profile here if trigger didn't fire (reserved for advanced logic)

    revalidatePath('/', 'layout')
    redirect('/profil')
}

export async function signout() {
    const supabase = await createClient()
    await supabase.auth.signOut()

    revalidatePath('/', 'layout')
    redirect('/login')
}
