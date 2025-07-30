"use client"

import { Badge } from "@/components/ui/badge"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Clock, BookOpen, TrendingUp, Target } from "lucide-react"
import Sidebar from "@/components/layout/sidebar"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function ActivityPage() {
  const router = useRouter()
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalTime: 0,
    averageKnowledge: 0,
    subjectsCount: 0,
    chaptersCount: 0,
    weeklyGoal: 5,
    completedThisWeek: 0,
  })

  const [recentSessions, setRecentSessions] = useState<any[]>([])

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    if (!localStorage.getItem("isLoggedIn")) {
      router.push("/se-connecter")
      return
    }

    // Charger les sessions depuis localStorage
    const savedSessions = localStorage.getItem("sessions")
    if (savedSessions) {
      const sessions = JSON.parse(savedSessions)
      setRecentSessions(sessions.slice(-5).reverse()) // 5 dernières sessions

      // Calculer les statistiques
      const totalTime = sessions.reduce((total: number, session: any) => total + (session.duration || 0), 0)
      setStats((prev) => ({
        ...prev,
        totalSessions: sessions.length,
        totalTime: Math.round(totalTime / 60), // Convertir en minutes
        completedThisWeek: sessions.filter((s: any) => {
          const sessionDate = new Date(s.date)
          const weekAgo = new Date()
          weekAgo.setDate(weekAgo.getDate() - 7)
          return sessionDate > weekAgo
        }).length,
      }))
    }

    // Charger les statistiques depuis localStorage
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
  }, [router])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    return `${mins} min`
  }

  const getFeedbackColor = (feedback: string) => {
    switch (feedback) {
      case "facile":
        return "bg-green-100 text-green-800"
      case "moyen":
        return "bg-yellow-100 text-yellow-800"
      case "difficile":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <Button variant="outline" className="mb-6" onClick={() => router.push("/")}>Retour à l'accueil</Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Activité</h1>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sessions totales</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalSessions}</div>
                <p className="text-xs text-muted-foreground">Sessions d'étude complétées</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Temps d'étude</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalTime}min</div>
                <p className="text-xs text-muted-foreground">Temps total d'apprentissage</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Connaissance moyenne</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.averageKnowledge}%</div>
                <p className="text-xs text-muted-foreground">Toutes matières confondues</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Objectif hebdomadaire</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.completedThisWeek}/{stats.weeklyGoal}
                </div>
                <Progress value={(stats.completedThisWeek / stats.weeklyGoal) * 100} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          {/* Recent Sessions */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Sessions récentes</CardTitle>
              <CardDescription>Vos dernières sessions d'étude</CardDescription>
            </CardHeader>
            <CardContent>
              {recentSessions.length > 0 ? (
                <div className="space-y-4">
                  {recentSessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{session.chapter}</h4>
                          <p className="text-sm text-gray-600">{session.subject}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge className={getFeedbackColor(session.feedback)}>
                          {session.feedback === "facile"
                            ? "😊 Facile"
                            : session.feedback === "moyen"
                              ? "😐 Moyen"
                              : session.feedback === "difficile"
                                ? "😓 Difficile"
                                : session.feedback}
                        </Badge>
                        <div className="text-right">
                          <p className="text-sm font-medium">{formatDuration(session.duration)}</p>
                          <p className="text-xs text-gray-600">{formatDate(session.date)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune session pour le moment</h3>
                  <p className="text-gray-600">
                    Commencez votre première session d'étude pour voir vos statistiques ici.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Weekly Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Aperçu de la semaine</CardTitle>
              <CardDescription>Votre activité des 7 derniers jours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day, index) => {
                  const hasActivity = index < stats.completedThisWeek
                  return (
                    <div key={day} className="text-center">
                      <p className="text-xs text-gray-600 mb-2">{day}</p>
                      <div
                        className={`w-8 h-8 rounded-full mx-auto ${hasActivity ? "bg-green-500" : "bg-gray-200"}`}
                      ></div>
                      <p className="text-xs mt-1">{hasActivity ? "✓" : ""}</p>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
