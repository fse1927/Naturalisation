'use client';

import { useState, useRef } from 'react';
import { signup } from '@/app/(auth)/actions';
import { Lock, Mail, User, Eye, EyeOff } from 'lucide-react';

export function SignupForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (formData: FormData) => {
        setLoading(true);
        setError('');

        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        if (!password || password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères.');
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas.');
            setLoading(false);
            return;
        }

        try {
            await signup(formData);
        } catch (e: any) {
            console.error('Signup form error:', e);
            setError(e?.message || 'Erreur lors de l\'inscription.');
            setLoading(false);
        }
    };

    return (
        <form ref={formRef} action={handleSubmit}>
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
                            type={showPassword ? "text" : "password"}
                            required
                            minLength={6}
                            className="appearance-none rounded-lg relative block w-full pl-10 pr-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                            placeholder="Mot de passe (min. 6 caractères)"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="sr-only">Confirmer le mot de passe</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showPassword ? "text" : "password"}
                            required
                            minLength={6}
                            className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                            placeholder="Confirmer le mot de passe"
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
                <div className="text-red-500 text-sm text-center mt-4 p-2 bg-red-50 rounded-lg">
                    {error}
                </div>
            )}

            <div className="mt-6">
                <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70"
                >
                    {loading ? 'Inscription en cours...' : "S'inscrire"}
                </button>
            </div>
        </form>
    );
}
