'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

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
    const headerList = await headers()
    const origin = headerList.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const fullName = formData.get('fullName') as string
    const situation = formData.get('situation') as string

    console.log('[Signup Action] Attempting signup for:', email)

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${origin}/auth/callback`,
            data: {
                full_name: fullName,
                situation: situation,
            }
        }
    })

    if (error) {
        console.error('[Signup Action] Error:', error.message)
        redirect(`/signup?error=${encodeURIComponent(error.message)}`)
    }

    console.log('[Signup Action] Success:', data?.user?.id)

    revalidatePath('/', 'layout')
    redirect('/signup?message=Check your email for confirmation link')
}

export async function signout() {
    const supabase = await createClient()
    await supabase.auth.signOut()

    revalidatePath('/', 'layout')
    redirect('/login')
}
