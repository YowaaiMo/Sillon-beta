"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Mail } from "lucide-react"

export default function MotDePasseOubliePage() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simuler l'envoi d'un email de réinitialisation
    setIsSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-indigo-600 flex items-center justify-center p-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Mail className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Mot de passe oublié</CardTitle>
          <CardDescription>
            {isSubmitted
              ? "Vérifiez votre boîte email"
              : "Entrez votre email pour recevoir un lien de réinitialisation"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Adresse email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Envoyer le lien de réinitialisation
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">✓</span>
              </div>
              <p className="text-gray-600">
                Un email de réinitialisation a été envoyé à <strong>{email}</strong>
              </p>
              <p className="text-sm text-gray-500">
                Vérifiez votre boîte de réception et suivez les instructions pour réinitialiser votre mot de passe.
              </p>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link href="/se-connecter" className="inline-flex items-center text-sm text-blue-600 hover:underline">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Retour à la connexion
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
