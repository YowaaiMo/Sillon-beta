"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Sidebar from "@/components/layout/sidebar"
import { useRouter } from "next/navigation"

export default function ParametresPage() {
  const router = useRouter()
  const [memoryType, setMemoryType] = useState("moyen")
  const [difficultyWeight, setDifficultyWeight] = useState([50])
  const [knowledgeThreshold, setKnowledgeThreshold] = useState([40])
  const [profile, setProfile] = useState({
    prenom: "",
    nom: "",
    email: "",
  })
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    if (!localStorage.getItem("isLoggedIn")) {
      router.push("/se-connecter")
      return
    }

    // Charger les données de l'utilisateur connecté
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const currentUserEmail = localStorage.getItem("userEmail")
    const currentUser = users.find((u: any) => u.email === currentUserEmail)

    if (currentUser) {
      setProfile({
        prenom: currentUser.prenom,
        nom: currentUser.nom,
        email: currentUser.email,
      })
    }
  }, [router])

  const handleSaveProfile = () => {
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const currentUserEmail = localStorage.getItem("userEmail")
    const userIndex = users.findIndex((u: any) => u.email === currentUserEmail)

    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...profile }
      localStorage.setItem("users", JSON.stringify(users))
      alert("Profil mis à jour avec succès !")
    }
  }

  const handleDeleteAccount = () => {
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const currentUserEmail = localStorage.getItem("userEmail")
    const filteredUsers = users.filter((u: any) => u.email !== currentUserEmail)

    localStorage.setItem("users", JSON.stringify(filteredUsers))
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("subjects")
    localStorage.removeItem("events")

    router.push("/se-connecter")
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <div className="p-8 max-w-4xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Paramètres</h1>

          <div className="space-y-8">
            {/* Profile Section */}
            <Card>
              <CardHeader>
                <CardTitle>Profil</CardTitle>
                <CardDescription>Modifiez vos informations personnelles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="prenom">Prénom</Label>
                    <Input
                      id="prenom"
                      value={profile.prenom}
                      onChange={(e) => setProfile((prev) => ({ ...prev, prenom: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="nom">Nom</Label>
                    <Input
                      id="nom"
                      value={profile.nom}
                      onChange={(e) => setProfile((prev) => ({ ...prev, nom: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="password">Nouveau mot de passe</Label>
                  <Input id="password" type="password" placeholder="Laissez vide pour ne pas changer" />
                </div>
                <Button onClick={handleSaveProfile}>Sauvegarder les modifications</Button>
              </CardContent>
            </Card>

            {/* Algorithm Section */}
            <Card>
              <CardHeader>
                <CardTitle>Algorithme</CardTitle>
                <CardDescription>
                  Personnalisez l'algorithme selon votre type de mémoire et vos préférences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="memory-type">Mon type de mémoire</Label>
                  <Select value={memoryType} onValueChange={setMemoryType}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellente (courbe verte)</SelectItem>
                      <SelectItem value="bon">Bonne (courbe jaune)</SelectItem>
                      <SelectItem value="moyen">Moyenne (courbe grise)</SelectItem>
                      <SelectItem value="faible">Faible (courbe orange)</SelectItem>
                      <SelectItem value="tres-faible">Très faible (courbe bleue)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-600 mt-2">
                    Choisissez le type de mémoire qui vous correspond le mieux. Cela ajustera la courbe d'oubli utilisée
                    par l'algorithme.
                  </p>
                </div>

                <Separator />

                <div>
                  <Label>Poids de la difficulté dans le calcul</Label>
                  <div className="mt-4 mb-2">
                    <Slider
                      value={difficultyWeight}
                      onValueChange={setDifficultyWeight}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Faible influence</span>
                    <span className="font-medium">{difficultyWeight[0]}%</span>
                    <span>Forte influence</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Ajustez l'importance de la difficulté perçue dans le calcul du taux de connaissance.
                  </p>
                </div>

                <Separator />

                <div>
                  <Label>Seuil de connaissance pour révision</Label>
                  <div className="mt-4 mb-2">
                    <Slider
                      value={knowledgeThreshold}
                      onValueChange={setKnowledgeThreshold}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>0%</span>
                    <span className="font-medium">{knowledgeThreshold[0]}%</span>
                    <span>100%</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Définissez le seuil en dessous duquel un chapitre sera automatiquement programmé pour révision.
                  </p>
                </div>

                <Button>Sauvegarder les paramètres</Button>
              </CardContent>
            </Card>

            {/* Account Section */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600">Zone de danger</CardTitle>
                <CardDescription>Actions irréversibles sur votre compte</CardDescription>
              </CardHeader>
              <CardContent>
                <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive">Supprimer mon compte</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Êtes-vous sûr de vouloir supprimer votre compte ?</DialogTitle>
                      <DialogDescription>
                        Cette action est irréversible. Toutes vos données (matières, chapitres, sessions, événements)
                        seront définitivement supprimées.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                        Annuler
                      </Button>
                      <Button variant="destructive" onClick={handleDeleteAccount}>
                        Supprimer définitivement
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <p className="text-sm text-gray-600 mt-2">
                  Cette action est irréversible. Toutes vos données seront définitivement supprimées.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
