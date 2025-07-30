"use client"

import Link from "next/link"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, BrainCircuit } from "lucide-react" // Added BrainCircuit icon
import Sidebar from "@/components/layout/sidebar"
import { useParams, useRouter } from "next/navigation"

const difficultyColors = {
  Facile: "bg-green-100 text-green-800",
  Moyen: "bg-yellow-100 text-yellow-800",
  Difficile: "bg-red-100 text-red-800",
}

export default function SubjectChaptersPage() {
  const params = useParams()
  const router = useRouter()
  const [chapters, setChapters] = useState<any[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newChapter, setNewChapter] = useState({
    name: "",
    pages: "",
    estimatedTime: "",
    difficulty: "3",
    content: "", // New field for chapter content
  })
  const [subjectName, setSubjectName] = useState("Chargement...")
  const [subjectId, setSubjectId] = useState<number | null>(null)

  useEffect(() => {
    if (!localStorage.getItem("isLoggedIn")) {
      router.push("/se-connecter")
      return
    }

    const subjects = JSON.parse(localStorage.getItem("subjects") || "[]")
    const currentSubject = subjects.find((s: any) => s.id === Number(params.id))
    if (currentSubject) {
      setSubjectName(currentSubject.name)
      setSubjectId(currentSubject.id)
      const savedChapters = localStorage.getItem(`chapters_${currentSubject.name}`)
      if (savedChapters) {
        setChapters(JSON.parse(savedChapters))
      } else {
        setChapters([])
      }
    } else {
      router.push("/matieres") // Rediriger si la matière n'existe pas
    }
  }, [params.id, router])

  const handleAddChapter = () => {
    if (newChapter.name && newChapter.pages && newChapter.estimatedTime) {
      const newId = chapters.length > 0 ? Math.max(...chapters.map((c) => c.id)) + 1 : 1
      const difficultyMap = { "1": "Facile", "2": "Facile", "3": "Moyen", "4": "Difficile", "5": "Difficile" }
      const updatedChapters = [
        ...chapters,
        {
          id: newId,
          name: newChapter.name,
          difficulty: difficultyMap[newChapter.difficulty as keyof typeof difficultyMap],
          revisions: 0,
          timeSpent: 0,
          knowledge: 0,
          content: newChapter.content, // Save content
        },
      ]
      setChapters(updatedChapters)
      localStorage.setItem(`chapters_${subjectName}`, JSON.stringify(updatedChapters))
      setNewChapter({ name: "", pages: "", estimatedTime: "", difficulty: "3", content: "" })
      setIsAddModalOpen(false)
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{subjectName}</h1>
              <div className="flex items-center space-x-4 mt-4">
                <span className="text-gray-600 font-medium border-b-2 border-gray-900 pb-1">Statistiques</span>
                <span className="text-gray-400">Réglages</span>
              </div>
            </div>

            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter un chapitre
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Ajouter un nouveau chapitre</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nom du chapitre</Label>
                    <Input
                      id="name"
                      value={newChapter.name}
                      onChange={(e) => setNewChapter((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Ex: Les mitochondries"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pages">Nombre de pages/diapos</Label>
                    <Input
                      id="pages"
                      type="number"
                      value={newChapter.pages}
                      onChange={(e) => setNewChapter((prev) => ({ ...prev, pages: e.target.value }))}
                      placeholder="Ex: 15"
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">Temps estimé (minutes)</Label>
                    <Input
                      id="time"
                      type="number"
                      value={newChapter.estimatedTime}
                      onChange={(e) => setNewChapter((prev) => ({ ...prev, estimatedTime: e.target.value }))}
                      placeholder="Ex: 60"
                    />
                  </div>
                  <div>
                    <Label htmlFor="difficulty">Difficulté perçue (1-5)</Label>
                    <Select
                      value={newChapter.difficulty}
                      onValueChange={(value) => setNewChapter((prev) => ({ ...prev, difficulty: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 - Très facile</SelectItem>
                        <SelectItem value="2">2 - Facile</SelectItem>
                        <SelectItem value="3">3 - Moyen</SelectItem>
                        <SelectItem value="4">4 - Difficile</SelectItem>
                        <SelectItem value="5">5 - Très difficile</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="content">Contenu du chapitre (pour l'IA)</Label>
                    <Input
                      id="content"
                      value={newChapter.content}
                      onChange={(e) => setNewChapter((prev) => ({ ...prev, content: e.target.value }))}
                      placeholder="Collez ici le contenu du cours pour ce chapitre..."
                    />
                  </div>
                  <Button onClick={handleAddChapter} className="w-full">
                    Ajouter le chapitre
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center space-x-4 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder="Rechercher dans vos chapitres..." className="pl-10" />
            </div>
            {/* Removed Sort and Filter buttons */}
          </div>

          {/* Chapters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chapters.map((chapter) => (
              <div
                key={chapter.id}
                className="bg-orange-50 border border-orange-200 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 flex-1">{chapter.name}</h3>
                    <div className="ml-4 flex-shrink-0">
                      <div className="relative w-16 h-16">
                        <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="2"
                          />
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#f97316"
                            strokeWidth="2"
                            strokeDasharray={`${chapter.knowledge}, 100`}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-sm font-bold text-gray-900">{chapter.knowledge}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <Badge className={difficultyColors[chapter.difficulty as keyof typeof difficultyColors]}>
                      {chapter.difficulty}
                    </Badge>

                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{chapter.revisions} fois</span>
                      <span>{chapter.timeSpent} min</span>
                    </div>
                  </div>
                </div>
                {chapter.content && subjectId !== null && (
                  <Link href={`/matieres/${subjectId}/${chapter.id}/quiz`}>
                    <Button variant="outline" className="w-full mt-auto bg-transparent">
                      <BrainCircuit className="w-4 h-4 mr-2" />
                      Lancer un quiz
                    </Button>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
