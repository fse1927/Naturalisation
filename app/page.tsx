import Link from "next/link";
import { ArrowRight, BookOpen, Flag, GraduationCap, CheckCircle2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50/50">

      {/* Hero Section */}
      <div className="relative overflow-hidden pt-12 pb-20 lg:pt-20">
        <div className="container px-4 mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-blue-100/50 border border-blue-200 text-blue-800 px-4 py-1.5 rounded-full text-sm font-medium mb-8 animate-in slide-in-from-top-4 fade-in duration-700">
            <Flag className="w-4 h-4" />
            <span>N°1 pour la naturalisation</span>
          </div>

          <h1 className="text-4xl lg:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight max-w-4xl mx-auto animate-in slide-in-from-bottom-4 fade-in duration-700 delay-100">
            Devenez citoyen français <span className="text-primary block mt-2">en toute confiance.</span>
          </h1>

          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed animate-in slide-in-from-bottom-4 fade-in duration-700 delay-200">
            L'application complète pour maîtriser l'entretien, apprendre l'histoire et tester vos connaissances.
            <span className="font-semibold text-gray-900"> 100% gratuit et interactif.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md mx-auto animate-in slide-in-from-bottom-4 fade-in duration-700 delay-300">
            <Link href="/apprendre" className="w-full sm:w-auto">
              <Button size="lg" className="w-full h-14 text-lg rounded-xl shadow-lg shadow-blue-900/20 hover:scale-105 transition-transform">
                <BookOpen className="mr-2 h-5 w-5" />
                Commencer maintenant
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full h-14 text-lg rounded-xl border-gray-200 hover:bg-white hover:text-primary hover:border-primary transition-colors">
                Se connecter
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative background elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-200/20 rounded-full blur-3xl -z-10" />
      </div>

      {/* Features Grid */}
      <div className="container px-4 mx-auto pb-24">
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mb-6">
              <GraduationCap className="w-6 h-6 text-amber-700" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Apprentissage Guidé</h3>
            <p className="text-gray-500 leading-relaxed">
              Des fiches de révision structurées sur l'histoire, la géographie et les valeurs de la République.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
              <CheckCircle2 className="w-6 h-6 text-blue-700" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Quiz Intelligents</h3>
            <p className="text-gray-500 leading-relaxed">
              Plus de 200 questions pour tester vos connaissances et suivre votre progression en temps réel.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
              <Star className="w-6 h-6 text-green-700" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Simulateur d'Entretien</h3>
            <p className="text-gray-500 leading-relaxed">
              Entraînez-vous avec les questions fréquentes posées par les agents de préfecture.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center pb-8 text-sm text-gray-400">
        <p>© 2025 France Citoyen. Conçu pour votre réussite.</p>
      </div>
    </div>
  );
}
