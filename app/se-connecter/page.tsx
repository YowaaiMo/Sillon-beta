"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label" // Keep Label for accessibility, visually hidden
import { useRouter } from "next/navigation"
import { SillonLogo } from "@/components/ui/logo"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { loadDemoData } from "@/lib/demo-data"
import Link from "next/link"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    motDePasse: "",
  })
  const router = useRouter()
  const [error, setError] = useState("")

  const handleStartDemo = () => {
    loadDemoData()
    router.push("/matieres")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const user = users.find((u: any) => u.email === formData.email && u.password === formData.motDePasse)

    if (user) {
      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem("userEmail", formData.email)
      router.push("/matieres")
    } else {
      setError("Email ou mot de passe incorrect")
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form with enhanced styling */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden">
        {/* Abstract background shapes */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-300 opacity-10 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-300 opacity-10 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/4 right-1/4 w-56 h-56 bg-orange-300 opacity-10 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>

        <Card className="w-full max-w-md shadow-lg border-none bg-white rounded-xl relative z-10">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <SillonLogo className="w-12 h-12 text-blue-600" />
              <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Sillon
              </CardTitle>
            </div>
            <CardDescription className="text-lg text-gray-700">
              Connectez-vous pour continuer votre apprentissage
            </CardDescription>
            <Button
              variant="outline"
              className="w-full border-2 border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700 py-2 rounded-xl font-semibold mb-4 bg-transparent"
              onClick={handleStartDemo}
            >
              Accéder au Mode Démo
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="sr-only">
                  Email
                </Label>{" "}
                {/* Visually hidden label */}
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="Nom d'utilisateur, adresse email ou numéro de téléphone"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <Label htmlFor="motDePasse" className="sr-only">
                  Mot de passe
                </Label>{" "}
                {/* Visually hidden label */}
                <Input
                  id="motDePasse"
                  type="password"
                  value={formData.motDePasse}
                  onChange={(e) => setFormData((prev) => ({ ...prev, motDePasse: e.target.value }))}
                  placeholder="Mot de passe"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-xl font-semibold"
              >
                Se connecter
              </Button>
            </form>

            {error && (
              <div className="mt-4 text-red-600 text-sm text-center bg-red-50 p-2 rounded-md border border-red-200">
                {error}
              </div>
            )}

            <div className="mt-4 text-center">
              <Link href="/mot-de-passe-oublie" className="text-sm text-blue-600 hover:underline font-medium">
                Mot de passe oublié ?
              </Link>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                Pas encore de compte ?{" "}
                <Link href="/creer-un-compte" className="text-blue-600 hover:underline font-medium">
                  Créer un compte
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right side - Illustration */}
      <div className="flex-1 bg-gradient-to-br from-blue-400 via-purple-500 to-indigo-600 flex items-center justify-center p-8">
        <div className="text-center text-white max-w-lg">
          <div className="mb-8">
            <div className="relative">
              {/* Animation du sillon avec le nouveau logo */}
              <div className="w-64 h-64 mx-auto mb-8 relative">
                <SillonLogo className="w-full h-full text-white animate-pulse" />
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-6">Bon retour !</h2>
          <p className="text-lg opacity-90">Continuez à creuser vos sillons de connaissance</p>
        </div>
      </div>
    </div>
  )
}
