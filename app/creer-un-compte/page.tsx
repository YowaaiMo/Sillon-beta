"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label" // Keep Label for accessibility, visually hidden
import { SillonLogo } from "@/components/ui/logo"
import { useRouter } from "next/navigation"
import { loadDemoData } from "@/lib/demo-data"
import Link from "next/link"

export default function CreateAccountPage() {
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    email: "",
    motDePasse: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const router = useRouter()

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string) => {
    return password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    const newErrors = { ...errors }
    if (field === "email" && value && !validateEmail(value)) {
      newErrors.email = "Format d'email invalide"
    } else if (field === "email") {
      delete newErrors.email
    }

    if (field === "motDePasse" && value && !validatePassword(value)) {
      newErrors.motDePasse = "Le mot de passe doit contenir au moins 8 caractères, 1 majuscule et 1 chiffre"
    } else if (field === "motDePasse") {
      delete newErrors.motDePasse
    }

    setErrors(newErrors)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (Object.keys(errors).length === 0 && formData.prenom && formData.nom && formData.email && formData.motDePasse) {
      const existingUsers = JSON.parse(localStorage.getItem("users") || "[]")

      if (existingUsers.find((u: any) => u.email === formData.email)) {
        setErrors({ email: "Cet email est déjà utilisé" })
        return
      }

      existingUsers.push({
        email: formData.email,
        password: formData.motDePasse,
        prenom: formData.prenom,
        nom: formData.nom,
        createdAt: new Date().toISOString(),
      })

      localStorage.setItem("users", JSON.stringify(existingUsers))
      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem("userEmail", formData.email)

      window.location.href = "/matieres"
    }
  }

  const handleStartDemo = () => {
    loadDemoData()
    router.push("/matieres")
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="w-full max-w-md space-y-6">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <SillonLogo className="w-12 h-12 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Sillon
            </h1>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 text-center">Créer un compte</h2>
          <Button
            variant="outline"
            className="w-full border-2 border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700 py-2 rounded-xl font-semibold bg-transparent mb-6"
            onClick={handleStartDemo}
          >
            Accéder au Mode Démo
          </Button>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="prenom" className="sr-only">
                Prénom
              </Label>
              <Input
                id="prenom"
                type="text"
                value={formData.prenom}
                onChange={(e) => handleInputChange("prenom", e.target.value)}
                placeholder="Prénom"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <Label htmlFor="nom" className="sr-only">
                Nom
              </Label>
              <Input
                id="nom"
                type="text"
                value={formData.nom}
                onChange={(e) => handleInputChange("nom", e.target.value)}
                placeholder="Nom"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <Label htmlFor="email" className="sr-only">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Adresse email"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <Label htmlFor="motDePasse" className="sr-only">
                Mot de passe
              </Label>
              <Input
                id="motDePasse"
                type="password"
                value={formData.motDePasse}
                onChange={(e) => handleInputChange("motDePasse", e.target.value)}
                placeholder="Mot de passe"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {errors.motDePasse && <p className="text-red-500 text-sm mt-1">{errors.motDePasse}</p>}
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-xl font-semibold"
            >
              S'inscrire
            </Button>
          </form>
          <div className="mt-6 pt-4 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Vous avez déjà un compte ?{" "}
              <Link href="/se-connecter" className="text-blue-600 hover:underline font-medium">
                Connectez-vous
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Animation et explication */}
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

          <h2 className="text-3xl font-bold mb-6">Sillon</h2>
          <div className="space-y-4 text-lg">
            <p className="opacity-90">
              <strong>Comme un sillon que l'on trace dans son cerveau.</strong>
            </p>
            <p className="opacity-80">
              L'apprentissage laisse une trace, et Sillon vous aide à la creuser plus profondément.
            </p>
            <p className="opacity-70">
              Chaque révision approfondit le sillon de la connaissance, rendant l'information plus accessible et
              durable.
            </p>
          </div>

          <div className="mt-8 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
            <p className="text-sm opacity-90">
              ✨ Tracez votre chemin vers la maîtrise avec un algorithme qui s'adapte à votre mémoire
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
