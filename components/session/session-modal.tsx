"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Pause, Square, Clock } from "lucide-react"

interface SessionModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SessionModal({ isOpen, onClose }: SessionModalProps) {
  const [step, setStep] = useState<"select" | "running" | "feedback">("select")
  const [selectedSubject, setSelectedSubject] = useState("")
  const [selectedChapter, setSelectedChapter] = useState("")
  const [subjects, setSubjects] = useState<any[]>([])
  const [chapters, setChapters] = useState<any[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [time, setTime] = useState(0)
  const [feedback, setFeedback] = useState("")

  useEffect(() => {
    // Charger les matières
    const savedSubjects = localStorage.getItem("subjects")
    if (savedSubjects) {
      setSubjects(JSON.parse(savedSubjects))
    }
  }, [])

  useEffect(() => {
    // Charger les chapitres quand une matière est sélectionnée
    if (selectedSubject) {
      const savedChapters = localStorage.getItem(`chapters_${selectedSubject}`)
      if (savedChapters) {
        setChapters(JSON.parse(savedChapters))
      } else {
        setChapters([])
      }
    }
  }, [selectedSubject])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const startSession = () => {
    if (!selectedSubject) return
    setStep("running")
    setIsRunning(true)
    setTime(0)
  }

  const pauseSession = () => {
    setIsRunning(!isRunning)
  }

  const endSession = () => {
    setIsRunning(false)
    setStep("feedback")
  }

  const submitFeedback = () => {
    // Sauvegarder la session
    const sessions = JSON.parse(localStorage.getItem("sessions") || "[]")
    const newSession = {
      id: Date.now(),
      subject: selectedSubject,
      chapter: selectedChapter || "Révision générale",
      duration: time,
      feedback,
      date: new Date().toISOString(),
    }
    sessions.push(newSession)
    localStorage.setItem("sessions", JSON.stringify(sessions))

    // Réinitialiser et fermer
    setStep("select")
    setSelectedSubject("")
    setSelectedChapter("")
    setTime(0)
    setFeedback("")
    onClose()
  }

  const handleClose = () => {
    if (step === "running" && isRunning) {
      setIsRunning(false)
    }
    setStep("select")
    setSelectedSubject("")
    setSelectedChapter("")
    setTime(0)
    setFeedback("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        {step === "select" && (
          <>
            <DialogHeader>
              <DialogTitle>Nouvelle session d'étude</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Matière</label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir une matière" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.name}>
                        {subject.icon} {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {chapters.length > 0 && (
                <div>
                  <label className="text-sm font-medium">Chapitre (optionnel)</label>
                  <Select value={selectedChapter} onValueChange={setSelectedChapter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un chapitre" />
                    </SelectTrigger>
                    <SelectContent>
                      {chapters.map((chapter) => (
                        <SelectItem key={chapter.id} value={chapter.name}>
                          {chapter.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button onClick={startSession} disabled={!selectedSubject} className="w-full">
                <Play className="w-4 h-4 mr-2" />
                Commencer la session
              </Button>
            </div>
          </>
        )}

        {step === "running" && (
          <>
            <DialogHeader>
              <DialogTitle>Session en cours</DialogTitle>
            </DialogHeader>
            <div className="text-center space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="text-sm text-gray-600 mb-2">
                    {selectedSubject} {selectedChapter && `- ${selectedChapter}`}
                  </div>
                  <div className="text-4xl font-bold text-blue-600 mb-4">{formatTime(time)}</div>
                  <div className="flex justify-center space-x-2">
                    <Button onClick={pauseSession} variant="outline">
                      {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button onClick={endSession} variant="destructive">
                      <Square className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <p className="text-sm text-gray-600">{isRunning ? "Session en cours..." : "Session en pause"}</p>
            </div>
          </>
        )}

        {step === "feedback" && (
          <>
            <DialogHeader>
              <DialogTitle>Comment s'est passée votre session ?</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{formatTime(time)}</div>
                <div className="text-sm text-gray-600">Temps d'étude</div>
              </div>

              <div>
                <label className="text-sm font-medium">Comment avez-vous trouvé cette session ?</label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <Button
                    variant={feedback === "facile" ? "default" : "outline"}
                    onClick={() => setFeedback("facile")}
                    className="text-sm"
                  >
                    😊 Facile
                  </Button>
                  <Button
                    variant={feedback === "moyen" ? "default" : "outline"}
                    onClick={() => setFeedback("moyen")}
                    className="text-sm"
                  >
                    😐 Moyen
                  </Button>
                  <Button
                    variant={feedback === "difficile" ? "default" : "outline"}
                    onClick={() => setFeedback("difficile")}
                    className="text-sm"
                  >
                    😓 Difficile
                  </Button>
                </div>
              </div>

              <Button onClick={submitFeedback} disabled={!feedback} className="w-full">
                Terminer la session
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
