import { signup } from '../actions'
import Link from 'next/link'
import { Lock, Mail, User } from 'lucide-react'
import { SignupForm } from './SignupForm'

export default async function SignupPage({
    searchParams,
}: {
    searchParams: Promise<{ message: string, error: string }>
}) {
    const { error, message } = await searchParams;
    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 bg-gray-50">
            <div className="w-full max-w-sm space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Créer un compte</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Déjà inscrit? <Link href="/login" className="font-medium text-primary hover:text-blue-600">Se connecter</Link>
                    </p>
                </div>

                {message && (
                    <div className="text-green-600 text-sm text-center p-3 bg-green-50 rounded-lg border border-green-200">
                        ✓ {message}
                    </div>
                )}

                {error && (
                    <div className="text-red-600 text-sm text-center p-3 bg-red-50 rounded-lg border border-red-200">
                        ✗ {decodeURIComponent(error)}
                    </div>
                )}

                <SignupForm />
            </div>
        </div>
    )
}
