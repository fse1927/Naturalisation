import { signup } from '../actions'
import Link from 'next/link'
import { Lock, Mail, User } from 'lucide-react'

export default async function SignupPage({
    searchParams,
}: {
    searchParams: Promise<{ message: string, error: string }>
}) {
    const { error } = await searchParams;
    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 bg-gray-50">
            <div className="w-full max-w-sm space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Créer un compte</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Déjà inscrit? <Link href="/login" className="font-medium text-primary hover:text-blue-600">Se connecter</Link>
                    </p>
                </div>

                <form>
                    <div className="space-y-4 rounded-md shadow-sm">
                        <div>
                            <label htmlFor="fullName" className="sr-only">Nom Prénom</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    required
                                    className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                    placeholder="Nom Prénom"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="sr-only">Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                    placeholder="Adresse Email"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="sr-only">Mot de passe</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                    placeholder="Mot de passe"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="situation" className="sr-only">Situation</label>
                            <select
                                id="situation"
                                name="situation"
                                required
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                            >
                                <option value="">Sélectionnez votre situation</option>
                                <option value="Célibataire">Célibataire</option>
                                <option value="Marié(e)">Marié(e)</option>
                                <option value="Étudiant(e)">Étudiant(e)</option>
                                <option value="Employé(e)">Employé(e)</option>
                            </select>
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center mt-2">
                            {error}
                        </div>
                    )}

                    <div className="mt-6">
                        <button
                            formAction={signup}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                            S&apos;inscrire
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
