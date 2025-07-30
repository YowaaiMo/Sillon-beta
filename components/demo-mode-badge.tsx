"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { XCircle } from "lucide-react"
import { clearDemoData } from "@/lib/demo-data"
import { useRouter } from "next/navigation"

export function DemoModeBadge() {
  const [isDemoMode, setIsDemoMode] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Vérifie si le mode démo est activé dans le localStorage
    setIsDemoMode(localStorage.getItem("isDemoMode") === "true")
  }, [])

  const handleExitDemo = () => {
    clearDemoData() // Efface les données de démonstration
    router.push("/") // Redirige vers la page d'accueil ou de connexion
  }

  // Si le mode démo n'est pas actif, le composant ne rend rien
  if (!isDemoMode) return null

  return (
    <div className="fixed top-4 right-4 z-50">
      <Badge className="bg-purple-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2">
        <span>Mode Démo</span>
        <button onClick={handleExitDemo} className="text-white/80 hover:text-white transition-colors">
          <XCircle className="w-4 h-4" />
        </button>
      </Badge>
    </div>
  )
}
