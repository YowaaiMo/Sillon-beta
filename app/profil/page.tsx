"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, BookOpen, TrendingUp, Award, Target, Camera } from "lucide-react" // Added Camera icon
import Sidebar from "@/components/layout/sidebar"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button" // Import Button

export default function ProfilPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null) // Ref for the hidden file input
  const [userProfile, setUserProfile] = useState({
    prenom: "",
    nom: "",
    email: "",
    createdAt: "",
    profilePicture: "", // New state for profile picture
  })
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalTime: 0,
    subjectsCount: 0,
    chaptersCount: 0,
    averageKnowledge: 0,
    streak: 0,
    level: 1,
    xp: 0,
    nextLevelXp: 100,
  })

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    if (!localStorage.getItem("isLoggedIn")) {
      router.push("/se-connecter")
      return
    }

    // Charger les données de l'utilisateur
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const currentUserEmail = localStorage.getItem("userEmail")
    const currentUser = users.find((u: any) => u.email === currentUserEmail)

    if (currentUser) {
      setUserProfile(currentUser)
    }

    // Charger les statistiques
    const savedSubjects = localStorage.getItem("subjects")
    if (savedSubjects) {
      const subjects = JSON.parse(savedSubjects)
      setStats((prev) => ({
        ...prev,
        subjectsCount: subjects.length,
        chaptersCount: subjects.reduce((total: number, subject: any) => total + (subject.chapters || 0), 0),
        averageKnowledge:
          subjects.length > 0
            ? Math.round(
                subjects.reduce((total: number, subject: any) => total + (subject.progress || 0), 0) / subjects.length,
              )
            : 0,
      }))
    }

    const savedSessions = localStorage.getItem("sessions")
    if (savedSessions) {
      const sessions = JSON.parse(savedSessions)
      const totalTime = sessions.reduce((total: number, session: any) => total + (session.duration || 0), 0)
      setStats((prev) => ({
        ...prev,
        totalSessions: sessions.length,
        totalTime: Math.round(totalTime / 60), // Convertir en minutes
      }))
    }
  }, [router])

  const formatDate = (dateString: string) => {
    if (!dateString) return "Non défini"
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getDaysActive = () => {
    if (!userProfile.createdAt) return 0
    const createdDate = new Date(userProfile.createdAt)
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - createdDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const achievements = [
    { name: "Premier pas", description: "Créer votre premier compte", unlocked: true, icon: "🎯" },
    { name: "Organisé", description: "Créer votre première matière", unlocked: stats.subjectsCount > 0, icon: "📚" },
    { name: "Planificateur", description: "Créer votre premier événement", unlocked: false, icon: "📅" },
    { name: "Assidu", description: "Compléter 10 sessions", unlocked: stats.totalSessions >= 10, icon: "🔥" },
    {
      name: "Expert",
      description: "Atteindre 80% de connaissance moyenne",
      unlocked: stats.averageKnowledge >= 80,
      icon: "🏆",
    },
  ]

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setUserProfile((prev) => ({ ...prev, profilePicture: base64String }))

        // Update localStorage for the current user
        const users = JSON.parse(localStorage.getItem("users") || "[]")
        const currentUserEmail = localStorage.getItem("userEmail")
        const userIndex = users.findIndex((u: any) => u.email === currentUserEmail)

        if (userIndex !== -1) {
          users[userIndex] = { ...users[userIndex], profilePicture: base64String }
          localStorage.setItem("users", JSON.stringify(users))
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Profil</h1>

          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center space-x-6">
                <div className="relative group">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={userProfile.profilePicture || "/placeholder.svg?height=80&width=80"} />
                    <AvatarFallback className="text-2xl">
                      {userProfile.prenom && userProfile.nom ? `${userProfile.prenom[0]}${userProfile.nom[0]}` : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute bottom-0 right-0 rounded-full w-8 h-8 bg-white border-gray-300 group-hover:bg-gray-100"
                    onClick={triggerFileInput}
                    aria-label="Changer la photo de profil"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleProfilePictureChange}
                    accept="image/*"
                    capture="user" // 'user' for front camera, 'environment' for rear camera, or just 'camera' for default
                    className="hidden"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {userProfile.prenom} {userProfile.nom}
                  </h2>
                  <p className="text-gray-600">{userProfile.email}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <Badge variant="secondary" className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>Membre depuis {getDaysActive()} jours</span>
                    </Badge>
                    <Badge variant="outline" className="flex items-center space-x-1">
                      <Award className="w-3 h-3" />
                      <span>Niveau {stats.level}</span>
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600 mb-1">Progression niveau</div>
                  <Progress value={(stats.xp / stats.nextLevelXp) * 100} className="w-32" />
                  <div className="text-xs text-gray-500 mt-1">
                    {stats.xp} / {stats.nextLevelXp} XP
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Statistics */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Statistiques d'apprentissage</CardTitle>
                  <CardDescription>Votre progression dans Sillon</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-blue-600">{stats.subjectsCount}</div>
                      <div className="text-sm text-gray-600">Matières</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-green-600">{stats.chaptersCount}</div>
                      <div className="text-sm text-gray-600">Chapitres</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-purple-600">{stats.totalTime}min</div>
                      <div className="text-sm text-gray-600">Temps d'étude</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-orange-600">{stats.averageKnowledge}%</div>
                      <div className="text-sm text-gray-600">Connaissance moy.</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Activité récente</CardTitle>
                  <CardDescription>Vos dernières actions dans l'application</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Compte créé</p>
                        <p className="text-sm text-gray-600">{formatDate(userProfile.createdAt)}</p>
                      </div>
                    </div>
                    {stats.subjectsCount > 0 && (
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <Target className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">Première matière créée</p>
                          <p className="text-sm text-gray-600">Bravo pour ce premier pas !</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Achievements */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Succès</CardTitle>
                  <CardDescription>Vos accomplissements dans Sillon</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {achievements.map((achievement, index) => (
                      <div
                        key={index}
                        className={`flex items-center space-x-3 p-3 rounded-lg ${
                          achievement.unlocked ? "bg-green-50 border border-green-200" : "bg-gray-50"
                        }`}
                      >
                        <div className="text-2xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <p className={`font-medium ${achievement.unlocked ? "text-green-800" : "text-gray-600"}`}>
                            {achievement.name}
                          </p>
                          <p className={`text-sm ${achievement.unlocked ? "text-green-600" : "text-gray-500"}`}>
                            {achievement.description}
                          </p>
                        </div>
                        {achievement.unlocked && (
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
