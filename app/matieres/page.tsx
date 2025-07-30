"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Plus, X } from "lucide-react"
import Sidebar from "@/components/layout/sidebar"
import Link from "next/link"
import { useRouter } from "next/navigation"

const colorClasses = {
  orange: "bg-orange-100 border-orange-200",
  green: "bg-green-100 border-green-200",
  purple: "bg-purple-100 border-purple-200",
  blue: "bg-blue-100 border-blue-200",
}

const iconBgClasses = {
  orange: "bg-orange-500",
  green: "bg-green-500",
  purple: "bg-purple-500",
  blue: "bg-blue-500",
}

export default function MatieresPage() {
  const router = useRouter()
  const [subjects, setSubjects] = useState<any[]>([])

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    if (!localStorage.getItem("isLoggedIn")) {
      router.push("/se-connecter")
      return
    }

    // Charger les matières depuis localStorage
    const savedSubjects = localStorage.getItem("subjects")
    if (savedSubjects) {
      setSubjects(JSON.parse(savedSubjects))
    }
  }, [])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newSubject, setNewSubject] = useState({
    name: "",
    icon: "",
    color: "orange",
    progress: "",
  })

  const handleAddSubject = () => {
    console.log("Tentative de création de matière:", newSubject) // Debug

    // Validation plus simple
    if (!newSubject.name.trim()) {
      alert("Veuillez saisir un nom de matière")
      return
    }

    if (!newSubject.icon.trim()) {
      alert("Veuillez saisir une icône")
      return
    }

    try {
      const newId = subjects.length > 0 ? Math.max(...subjects.map((s) => s.id)) + 1 : 1
      const newSubjectData = {
        id: newId,
        name: newSubject.name.trim(),
        icon: newSubject.icon.trim(),
        color: newSubject.color as keyof typeof colorClasses,
        chapters: 0,
        progress: Number.parseInt(newSubject.progress || "0"),
      }

      console.log("Nouvelle matière à ajouter:", newSubjectData) // Debug

      const updatedSubjects = [...subjects, newSubjectData]
      setSubjects(updatedSubjects)
      localStorage.setItem("subjects", JSON.stringify(updatedSubjects))

      // Réinitialiser le formulaire
      setNewSubject({ name: "", icon: "", color: "orange", progress: "" })
      setIsAddModalOpen(false)

      console.log("Matière créée avec succès!") // Debug
    } catch (error) {
      console.error("Erreur lors de la création:", error)
      alert("Erreur lors de la création de la matière")
    }
  }

  const handleDeleteSubject = (id: number) => {
    const updatedSubjects = subjects.filter((s) => s.id !== id)
    setSubjects(updatedSubjects)
    localStorage.setItem("subjects", JSON.stringify(updatedSubjects))
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <Button variant="outline" className="mb-6" onClick={() => router.push("/")}>Retour à l'accueil</Button>
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Matières</h1>
              <div className="flex items-center space-x-4 mt-4">
                <span className="text-gray-600 font-medium">Statistiques</span>
                <span className="text-gray-400">Réglages</span>
              </div>
            </div>

            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter une matière
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Ajouter une nouvelle matière</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nom de la matière *</Label>
                    <Input
                      id="name"
                      value={newSubject.name}
                      onChange={(e) => setNewSubject((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Ex: Mathématiques"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="icon">Icône *</Label>
                    <Input
                      id="icon"
                      value={newSubject.icon}
                      onChange={(e) => setNewSubject((prev) => ({ ...prev, icon: e.target.value }))}
                      placeholder="Ex: 📚, ⚗️, 🌐, fx"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Vous pouvez utiliser des emojis ou du texte simple</p>
                  </div>
                  <div>
                    <Label htmlFor="color">Couleur</Label>
                    <Select
                      value={newSubject.color}
                      onValueChange={(value) => setNewSubject((prev) => ({ ...prev, color: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="orange">🟠 Orange</SelectItem>
                        <SelectItem value="green">🟢 Vert</SelectItem>
                        <SelectItem value="purple">🟣 Violet</SelectItem>
                        <SelectItem value="blue">🔵 Bleu</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="progress">Progression initiale (%)</Label>
                    <Input
                      id="progress"
                      type="number"
                      min="0"
                      max="100"
                      value={newSubject.progress}
                      onChange={(e) => setNewSubject((prev) => ({ ...prev, progress: e.target.value }))}
                      placeholder="0"
                    />
                  </div>
                  <Button
                    onClick={handleAddSubject}
                    className="w-full"
                    disabled={!newSubject.name.trim() || !newSubject.icon.trim()}
                  >
                    Ajouter la matière
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Filters */}

          {/* Subjects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {subjects.map((subject) => (
              <div key={subject.id} className="relative group">
                <Link href={`/matieres/${subject.id}`}>
                  <div
                    className={`p-6 rounded-xl border-2 cursor-pointer hover:shadow-lg transition-shadow ${colorClasses[subject.color]}`}
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div
                        className={`w-12 h-12 rounded-xl ${iconBgClasses[subject.color]} flex items-center justify-center text-white font-bold text-lg`}
                      >
                        {subject.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{subject.name}</h3>
                        <p className="text-sm text-gray-600">{subject.chapters} chapitres</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progression</span>
                        <span className="font-medium">{subject.progress}%</span>
                      </div>
                      <Progress value={subject.progress} className="h-2" />
                      {/* New: Mastery Level (1-9) */}
                      <div className="text-sm text-gray-600 mt-2">
                        Niveau de Maîtrise:{" "}
                        <span className="font-bold text-blue-700">
                          {Math.max(1, Math.min(9, Math.ceil(subject.progress / 10)))}
                        </span>{" "}
                        / 9
                      </div>
                    </div>
                  </div>
                </Link>
                <Button size="icon" variant="ghost" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleDeleteSubject(subject.id)} title="Supprimer la matière">
                  <X className="w-5 h-5 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
