"use client"

import { useState, useEffect } from "react"
import Sidebar from "@/components/layout/sidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Calendar, TrendingDown, BrainCircuit, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Chapter {
  id: number
  name: string
  difficulty: "Facile" | "Moyen" | "Difficile"
  revisions: number
  timeSpent: number
  knowledge: number
  content: string
}

interface Subject {
  id: number
  name: string
  icon: string
  color: string
  chapters: number
  progress: number
}

interface Event {
  id: number
  title: string
  subject: string
  date: string
  startTime: string
  endTime: string
  color: string
  type: "revision" | "cours" | "examen" | "autre"
}

interface RecommendedChapter extends Chapter {
  subjectName: string
  subjectId: number
  priorityScore: number
  reasons: string[]
}

const difficultyScores: Record<Chapter["difficulty"], number> = {
  Facile: 1,
  Moyen: 2,
  Difficile: 3,
}

const getDifficultyBadgeClass = (difficulty: Chapter["difficulty"]) => {
  switch (difficulty) {
    case "Facile":
      return "bg-green-100 text-green-800"
    case "Moyen":
      return "bg-yellow-100 text-yellow-800"
    case "Difficile":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function RecommendationsPage() {
  const router = useRouter()
  const [recommendedChapters, setRecommendedChapters] = useState<RecommendedChapter[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!localStorage.getItem("isLoggedIn")) {
      router.push("/se-connecter")
      return
    }

    const calculateRecommendations = () => {
      const subjects: Subject[] = JSON.parse(localStorage.getItem("subjects") || "[]")
      const events: Event[] = JSON.parse(localStorage.getItem("events") || "[]")
      const allChapters: RecommendedChapter[] = []

      subjects.forEach((subject) => {
        const chapters: Chapter[] = JSON.parse(localStorage.getItem(`chapters_${subject.name}`) || "[]")
        chapters.forEach((chapter) => {
          let priorityScore = 0
          const reasons: string[] = []

          // 1. Knowledge Score (lower knowledge = higher priority)
          // Max score for 0% knowledge, min for 100%
          priorityScore += (100 - chapter.knowledge) * 0.4 // Weight 40%
          if (chapter.knowledge < 50) {
            reasons.push(`Connaissance faible (${chapter.knowledge}%)`)
          }

          // 2. Difficulty Score (higher difficulty = higher priority)
          priorityScore += difficultyScores[chapter.difficulty] * 10 * 0.3 // Weight 30% (scale to match knowledge)
          if (chapter.difficulty === "Difficile") {
            reasons.push(`Difficulté : ${chapter.difficulty}`)
          }

          // 3. Exam Proximity Score (closer exam = higher priority)
          const relatedExams = events.filter((event) => event.type === "examen" && event.subject === subject.name)
          let minDaysUntilExam = Number.POSITIVE_INFINITY
          if (relatedExams.length > 0) {
            relatedExams.forEach((exam) => {
              const examDate = new Date(exam.date)
              const today = new Date()
              const diffTime = examDate.getTime() - today.getTime()
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
              if (diffDays >= 0 && diffDays < minDaysUntilExam) {
                minDaysUntilExam = diffDays
              }
            })
          }

          if (minDaysUntilExam !== Number.POSITIVE_INFINITY) {
            // Inverse relationship: closer exam = higher score
            // Example: 7 days -> 1/7, 1 day -> 1/1. Scale it.
            const examScore = minDaysUntilExam <= 7 ? (7 - minDaysUntilExam + 1) * 15 : 0 // Max 105 for today, 15 for 7 days
            priorityScore += examScore * 0.3 // Weight 30%
            if (minDaysUntilExam <= 7) {
              reasons.push(`Examen de ${subject.name} dans ${minDaysUntilExam} jours`)
            }
          }

          allChapters.push({
            ...chapter,
            subjectName: subject.name,
            subjectId: subject.id,
            priorityScore: Math.round(priorityScore),
            reasons: reasons.length > 0 ? reasons : ["À réviser régulièrement"],
          })
        })
      })

      // Sort by priority score (descending)
      allChapters.sort((a, b) => b.priorityScore - a.priorityScore)
      setRecommendedChapters(allChapters)
      setIsLoading(false)
    }

    calculateRecommendations()
  }, [router])

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 overflow-y-auto min-h-0">
        {" "}
        {/* Added overflow-y-auto and min-h-0 */}
        <div className="p-8 max-w-4xl mx-auto">
          <Button variant="outline" className="mb-6" onClick={() => router.push("/")}>Retour à l'accueil</Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Recommandations de révision</h1>
          <p className="text-gray-600 mb-8">
            Voici les chapitres que Sillon vous recommande de réviser en priorité, basées sur votre avancement, la
            difficulté et votre emploi du temps.
          </p>

          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-700">Calcul des recommandations...</span>
            </div>
          ) : recommendedChapters.length === 0 ? (
            <Card className="p-8 text-center">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune recommandation pour le moment</h3>
              <p className="text-gray-600">
                Ajoutez des matières, des chapitres et des examens pour que Sillon puisse vous aider à planifier vos
                révisions.
              </p>
            </Card>
          ) : (
            <div className="space-y-6">
              {recommendedChapters.map((chapter) => (
                <Card key={chapter.id} className="border-l-4 border-blue-500">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-semibold text-gray-900">{chapter.name}</CardTitle>
                      <Badge className="bg-blue-100 text-blue-800">Priorité: {chapter.priorityScore}</Badge>
                    </div>
                    <CardDescription className="text-gray-600">Matière: {chapter.subjectName}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <TrendingDown className="w-4 h-4 text-gray-500" />
                        <span>Connaissance: {chapter.knowledge}%</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <BookOpen className="w-4 h-4 text-gray-500" />
                        <span>Révisions: {chapter.revisions}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <Badge className={getDifficultyBadgeClass(chapter.difficulty)}>{chapter.difficulty}</Badge>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-800 mb-2">Pourquoi réviser ce chapitre ?</h4>
                      <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                        {chapter.reasons.map((reason, index) => (
                          <li key={index}>{reason}</li>
                        ))}
                      </ul>
                    </div>
                    {chapter.content && chapter.subjectId !== null && (
                      <Link href={`/matieres/${chapter.subjectId}/${chapter.id}/quiz`}>
                        <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                          <BrainCircuit className="w-4 h-4 mr-2" />
                          Lancer un quiz sur ce chapitre
                        </Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
