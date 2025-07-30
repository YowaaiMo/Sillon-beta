"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Activity, BookOpen, Calendar, Settings, User, LogOut, ListTodo } from "lucide-react" // Added ListTodo for recommendations
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { SillonLogo } from "@/components/ui/logo"
import SessionModal from "@/components/session/session-modal"

const navigation = [
  { name: "Activité", href: "/activite", icon: Activity },
  { name: "Matières", href: "/matieres", icon: BookOpen },
  { name: "Emploi du temps", href: "/emploi-du-temps", icon: Calendar },
  { name: "Recommandations", href: "/recommandations", icon: ListTodo }, // New link for recommendations
  { name: "Paramètres", href: "/parametres", icon: Settings },
  { name: "Profil", href: "/profil", icon: User },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("userEmail")
    router.push("/se-connecter")
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      {/* Logo */}
      <div className="p-6 flex items-center space-x-3">
        <SillonLogo className="w-8 h-8 text-blue-600" />
        <h1 className="text-2xl font-bold text-blue-600">Sillon</h1>
      </div>

      {/* User Profile */}
      <div className="px-6 pb-6">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=40&width=40" />
            <AvatarFallback>
              {(() => {
                const users = JSON.parse(localStorage.getItem("users") || "[]")
                const currentUserEmail = localStorage.getItem("userEmail")
                const currentUser = users.find((u: any) => u.email === currentUserEmail)
                if (currentUser) {
                  return `${currentUser.prenom[0]}${currentUser.nom[0]}`
                }
                return "U"
              })()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-gray-900">
              {(() => {
                const users = JSON.parse(localStorage.getItem("users") || "[]")
                const currentUserEmail = localStorage.getItem("userEmail")
                const currentUser = users.find((u: any) => u.email === currentUserEmail)
                if (currentUser) {
                  return `${currentUser.prenom} ${currentUser.nom}`
                }
                return "Utilisateur"
              })()}
            </p>
          </div>
        </div>
      </div>

      {/* Launch Session Button */}
      <div className="px-6 pb-6">
        <Button
          className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          onClick={() => setIsSessionModalOpen(true)}
        >
          Lancer une session
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-6">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600" : "text-gray-700 hover:bg-gray-50",
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-6">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Déconnexion
        </Button>
      </div>

      {/* Session Modal */}
      <SessionModal isOpen={isSessionModalOpen} onClose={() => setIsSessionModalOpen(false)} />
    </div>
  )
}
