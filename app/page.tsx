"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { SillonLogo } from "@/components/ui/logo"
import { Brain, Clock, TrendingUp, Users, BookOpen, Target, ArrowRight, CheckCircle, Zap } from "lucide-react"
import { loadDemoData } from "@/lib/demo-data"
// import AnimatedSection from "@/components/animated-section" // Removed import

export default function HomePage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn")
    if (loggedIn) {
      setIsLoggedIn(true)
    }
  }, [])

  const handleStartDemo = () => {
    loadDemoData()
    router.push("/matieres")
  }

  const features = [
    {
      icon: Brain,
      title: "Algorithme intelligent",
      description: "Adapté à votre courbe d'oubli personnelle",
      color: "from-purple-500 to-indigo-600",
    },
    {
      icon: Clock,
      title: "Sessions chronométrées",
      description: "Suivez votre temps d'étude en temps réel",
      color: "from-blue-500 to-cyan-600",
    },
    {
      icon: TrendingUp,
      title: "Progression visible",
      description: "Visualisez vos progrès et votre évolution",
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: Target,
      title: "Objectifs personnalisés",
      description: "Définissez et atteignez vos objectifs d'apprentissage",
      color: "from-orange-500 to-red-600",
    },
  ]

  const stats = [
    { number: "10k+", label: "Étudiants", icon: Users },
    { number: "50k+", label: "Sessions", icon: BookOpen },
    { number: "85%", label: "Réussite", icon: CheckCircle },
    { number: "24/7", label: "Disponible", icon: Zap },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="relative z-10 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <SillonLogo className="w-10 h-10 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Sillon</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="#" className="text-gray-600 hover:text-blue-600 font-medium">
                Sillon, c'est quoi ?
              </Link>
              <Link href="#" className="text-gray-600 hover:text-blue-600 font-medium">
                Pourquoi Sillon ?
              </Link>
              <Link href="#" className="text-gray-600 hover:text-blue-600 font-medium">
                Réseaux sociaux
              </Link>
              {isLoggedIn ? (
                <Button onClick={() => router.push("/matieres")} className="bg-blue-600 hover:bg-blue-700 text-white">
                  Accéder au dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Link href="/se-connecter">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">Se connecter</Button>
                </Link>
              )}
            </nav>
            {/* Mobile menu button would go here */}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-400 via-purple-500 to-indigo-600 py-20 md:py-32 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="mb-8">
            <div className="relative">
              <div className="w-48 h-48 mx-auto mb-8 relative">
                <SillonLogo className="w-full h-full text-white animate-pulse" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Maîtrisez vos connaissances avec <span className="text-yellow-300">Sillon</span>
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-10 max-w-3xl mx-auto">
            Sillon est l'application d'apprentissage intelligente qui s'adapte à votre mémoire, vous aidant à retenir
            plus longtemps et à réviser plus efficacement grâce à l'algorithme de la courbe d'oubli d'Ebbinghaus.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/creer-un-compte">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                Commencer gratuitement
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold bg-transparent"
              onClick={handleStartDemo}
            >
              Mode Démo
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Procédés de planification de l'apprentissage utilisés par Sillon
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center bg-gradient-to-br from-blue-50 to-purple-50">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Pourquoi choisir Sillon ?
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Une approche scientifique de l'apprentissage pour maximiser votre rétention
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 border-0 bg-white shadow-md"
              >
                <CardContent className="p-8">
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Prêt à transformer votre apprentissage ?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers d'étudiants qui ont déjà révolutionné leur façon d'apprendre
          </p>
          <Link href="/creer-un-compte">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
              Commencer gratuitement
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <SillonLogo className="w-8 h-8 text-blue-400" />
              <span className="text-xl font-bold">Sillon</span>
            </div>
            <div className="text-gray-400 text-sm">© 2024 Sillon. Creusez vos sillons de connaissance.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
