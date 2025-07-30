"use client"

import { Textarea } from "@/components/ui/textarea"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2, CheckCircle, XCircle, Lightbulb, MessageSquare } from "lucide-react"
import Sidebar from "@/components/layout/sidebar"
import { useParams, useRouter } from "next/navigation"

interface QuizQuestion {
  id: string
  question: string
  type: "short-answer" | "multiple-choice"
  options?: string[]
  correctAnswer?: string // This will be used for dummy evaluation
}

interface QuizResult {
  score: number
  totalQuestions: number
  feedback: string
  detailedFeedback: { question: string; userAnswer: string; correct: boolean; explanation?: string }[]
}

// Dummy function to generate quiz questions
const generateDummyQuizQuestions = (chapterName: string): QuizQuestion[] => {
  // In a real scenario, this would be more sophisticated or come from an API
  return [
    {
      id: "q1",
      question: `Quelle est la définition principale de l'${chapterName} ?`,
      type: "short-answer",
      correctAnswer: "C'est la branche des mathématiques qui étudie les vecteurs et les transformations linéaires.",
    },
    {
      id: "q2",
      question: `Quel est un outil fondamental en ${chapterName} ?`,
      type: "multiple-choice",
      options: ["Les fonctions trigonométriques", "Les matrices", "Les intégrales"],
      correctAnswer: "Les matrices",
    },
    {
      id: "q3",
      question: `Les vecteurs peuvent-ils être multipliés par des scalaires en ${chapterName} ?`,
      type: "short-answer",
      correctAnswer: "Oui",
    },
  ]
}

// Dummy function to evaluate quiz answers
const evaluateDummyQuiz = (questions: QuizQuestion[], userAnswers: Record<string, string>): QuizResult => {
  let score = 0
  const detailedFeedback: QuizResult["detailedFeedback"] = []

  questions.forEach((q) => {
    const userAnswer = userAnswers[q.id]?.trim().toLowerCase() || ""
    const correctAnswer = q.correctAnswer?.trim().toLowerCase() || ""
    let isCorrect = false
    let explanation = ""

    if (q.type === "short-answer") {
      // Simple check for short answers
      isCorrect = userAnswer === correctAnswer
      if (!isCorrect) {
        explanation = `La réponse attendue était : "${q.correctAnswer}".`
      }
    } else if (q.type === "multiple-choice") {
      isCorrect = userAnswer === correctAnswer
      if (!isCorrect) {
        explanation = `La bonne réponse était : "${q.correctAnswer}".`
      }
    }

    if (isCorrect) {
      score++
    }

    detailedFeedback.push({
      question: q.question,
      userAnswer: userAnswers[q.id] || "",
      correct: isCorrect,
      explanation: explanation,
    })
  })

  const percentage = (score / questions.length) * 100
  let feedback = ""
  if (percentage === 100) {
    feedback = "Félicitations ! Maîtrise parfaite du sujet."
  } else if (percentage >= 70) {
    feedback = "Très bonne performance ! Quelques points à revoir."
  } else if (percentage >= 40) {
    feedback = "Bonne tentative, mais il y a des lacunes importantes."
  } else {
    feedback = "Le sujet nécessite une révision approfondie."
  }

  return {
    score,
    totalQuestions: questions.length,
    feedback,
    detailedFeedback,
  }
}

export default function ChapterQuizPage() {
  const params = useParams()
  const router = useRouter()
  const subjectId = params.id as string
  const chapterId = params.chapterId as string

  const [chapter, setChapter] = useState<any>(null)
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([])
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({})
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null)
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false)
  const [isSubmittingQuiz, setIsSubmittingQuiz] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!localStorage.getItem("isLoggedIn")) {
      router.push("/se-connecter")
      return
    }

    // Load chapter content
    const subjects = JSON.parse(localStorage.getItem("subjects") || "[]")
    const currentSubject = subjects.find((s: any) => s.id === Number(subjectId))

    if (currentSubject) {
      const savedChapters = localStorage.getItem(`chapters_${currentSubject.name}`)
      if (savedChapters) {
        const chapters = JSON.parse(savedChapters)
        const currentChapter = chapters.find((c: any) => c.id === Number(chapterId))
        if (currentChapter) {
          setChapter(currentChapter)
          // Simulate loading questions
          setIsLoadingQuestions(true)
          setTimeout(() => {
            setQuizQuestions(generateDummyQuizQuestions(currentChapter.name))
            setIsLoadingQuestions(false)
          }, 1000) // Simulate network delay
        } else {
          router.push(`/matieres/${subjectId}`)
        }
      } else {
        router.push(`/matieres/${subjectId}`)
      }
    } else {
      router.push("/matieres")
    }
  }, [subjectId, chapterId, router])

  const handleAnswerChange = (questionId: string, value: string) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleSubmitQuiz = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmittingQuiz(true)
    setQuizResult(null)

    if (!chapter || !quizQuestions.length) {
      setError("Aucun quiz à soumettre.")
      setIsSubmittingQuiz(false)
      return
    }

    // Simulate quiz evaluation
    setTimeout(() => {
      const result = evaluateDummyQuiz(quizQuestions, userAnswers)
      setQuizResult(result)
      setIsSubmittingQuiz(false)
      updateChapterKnowledge(result.score, result.totalQuestions)
    }, 1500) // Simulate network delay
  }

  const updateChapterKnowledge = (score: number, totalQuestions: number) => {
    if (!chapter) return

    const percentageCorrect = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0
    let knowledgeIncrease = 0

    if (percentageCorrect >= 80) {
      knowledgeIncrease = 15 // Good mastery
    } else if (percentageCorrect >= 50) {
      knowledgeIncrease = 5 // Partial mastery
    } else {
      knowledgeIncrease = 0 // Needs more work
    }

    const newKnowledge = Math.min(100, chapter.knowledge + knowledgeIncrease)

    // Update localStorage
    const subjects = JSON.parse(localStorage.getItem("subjects") || "[]")
    const currentSubject = subjects.find((s: any) => s.id === Number(subjectId))
    if (currentSubject) {
      const savedChapters = JSON.parse(localStorage.getItem(`chapters_${currentSubject.name}`) || "[]")
      const chapterIndex = savedChapters.findIndex((c: any) => c.id === Number(chapterId))

      if (chapterIndex !== -1) {
        savedChapters[chapterIndex] = {
          ...savedChapters[chapterIndex],
          knowledge: newKnowledge,
          revisions: savedChapters[chapterIndex].revisions + 1,
        }
        localStorage.setItem(`chapters_${currentSubject.name}`, JSON.stringify(savedChapters))
        setChapter(savedChapters[chapterIndex]) // Update local state
      }
    }
  }

  if (!chapter) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-700">Chargement du chapitre...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <div className="p-8 max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Quiz : {chapter.name}</h1>
          <p className="text-gray-600 mb-8">
            Testez vos connaissances sur ce chapitre. (Questions et évaluation simulées)
          </p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <strong className="font-bold">Erreur :</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}

          {isLoadingQuestions ? (
            <Card className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-700">Génération des questions...</span>
            </Card>
          ) : quizQuestions.length > 0 && !quizResult ? (
            <form onSubmit={handleSubmitQuiz} className="space-y-6">
              {quizQuestions.map((q, index) => (
                <Card key={q.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Question {index + 1}: {q.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {q.type === "short-answer" && (
                      <Textarea
                        placeholder="Votre réponse..."
                        value={userAnswers[q.id] || ""}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                        rows={3}
                      />
                    )}
                    {q.type === "multiple-choice" && q.options && (
                      <div className="space-y-2">
                        {q.options.map((option, optIndex) => (
                          <Label key={optIndex} className="flex items-center space-x-2 cursor-pointer">
                            <Input
                              type="radio"
                              name={`question-${q.id}`}
                              value={option}
                              checked={userAnswers[q.id] === option}
                              onChange={() => handleAnswerChange(q.id, option)}
                            />
                            <span>{option}</span>
                          </Label>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
              <Button type="submit" className="w-full" disabled={isSubmittingQuiz}>
                {isSubmittingQuiz && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Soumettre le quiz
              </Button>
            </form>
          ) : quizResult ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5 text-blue-600" />
                  <span>Résultats du Quiz</span>
                </CardTitle>
                <CardDescription>
                  Vous avez obtenu {quizResult.score} sur {quizResult.totalQuestions} questions.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg font-semibold">{quizResult.feedback}</p>
                <div className="space-y-6">
                  {quizResult.detailedFeedback.map((item, index) => (
                    <div key={index} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-center space-x-2 mb-2">
                        {item.correct ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                        <p className="font-medium">{item.question}</p>
                      </div>
                      <p className="text-sm text-gray-700 ml-7">
                        Votre réponse :{" "}
                        <span className={item.correct ? "text-green-600" : "text-red-600"}>
                          {item.userAnswer || "(Pas de réponse)"}
                        </span>
                      </p>
                      {item.explanation && (
                        <p className="text-sm text-gray-500 ml-7 mt-1">Explication : {item.explanation}</p>
                      )}
                    </div>
                  ))}
                </div>
                <Button onClick={() => router.push(`/matieres/${subjectId}`)} className="w-full mt-4">
                  Retour aux chapitres
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="p-8 text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune question générée</h3>
              <p className="text-gray-600">
                Assurez-vous que le chapitre a du contenu pour que l'IA puisse générer un quiz.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
