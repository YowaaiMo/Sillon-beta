"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import Sidebar from "@/components/layout/sidebar"
import { useRouter } from "next/navigation"

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

const eventColors = {
  revision: "bg-blue-500",
  cours: "bg-green-500",
  examen: "bg-red-500",
  autre: "bg-purple-500",
}

const eventColorClasses = {
  revision: "bg-blue-100 border-blue-200 text-blue-800",
  cours: "bg-green-100 border-green-200 text-green-800",
  examen: "bg-red-100 border-red-200 text-red-800",
  autre: "bg-purple-100 border-purple-200 text-purple-800",
}

export default function SchedulePage() {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<"week" | "month">("week")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<Event[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [subjects, setSubjects] = useState<any[]>([])
  const [newEvent, setNewEvent] = useState({
    title: "",
    subject: "",
    date: "",
    startTime: "09:00",
    endTime: "10:00",
    type: "revision" as keyof typeof eventColors,
  })

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    if (!localStorage.getItem("isLoggedIn")) {
      router.push("/se-connecter")
      return
    }

    // Charger les événements et matières
    const savedEvents = localStorage.getItem("events")
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents))
    }

    const savedSubjects = localStorage.getItem("subjects")
    if (savedSubjects) {
      setSubjects(JSON.parse(savedSubjects))
    }
  }, [router])

  // Calculer les jours de la semaine courante
  const getWeekDays = (date: Date) => {
    const startOfWeek = new Date(date)
    const day = startOfWeek.getDay()
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1)
    startOfWeek.setDate(diff)

    const days = []
    const dayNames = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]

    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(startOfWeek)
      currentDay.setDate(startOfWeek.getDate() + i)
      days.push({
        name: dayNames[i],
        date: currentDay.getDate(),
        fullDate: new Date(currentDay),
        isToday: currentDay.toDateString() === new Date().toDateString(),
      })
    }

    return days
  }

  const weekDays = getWeekDays(currentDate)

  // Calculer les jours du mois
  const getMonthDays = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)

    // Commencer au lundi de la semaine contenant le 1er du mois
    const dayOfWeek = firstDay.getDay()
    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1
    startDate.setDate(firstDay.getDate() - diff)

    const days = []
    for (let i = 0; i < 42; i++) {
      // 6 semaines * 7 jours
      const currentDay = new Date(startDate)
      currentDay.setDate(startDate.getDate() + i)
      days.push({
        date: currentDay.getDate(),
        fullDate: new Date(currentDay),
        isCurrentMonth: currentDay.getMonth() === month,
        isToday: currentDay.toDateString() === new Date().toDateString(),
      })
    }

    return days
  }

  const monthDays = getMonthDays(currentDate)

  // Navigation
  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() + (direction === "next" ? 7 : -7))
    setCurrentDate(newDate)
  }

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    newDate.setMonth(currentDate.getMonth() + (direction === "next" ? 1 : -1))
    setCurrentDate(newDate)
  }

  const formatWeekRange = (date: Date) => {
    const startOfWeek = new Date(date)
    const day = startOfWeek.getDay()
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1)
    startOfWeek.setDate(diff)

    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)

    const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"]

    return `${startOfWeek.getDate()}-${endOfWeek.getDate()} ${months[startOfWeek.getMonth()]}`
  }

  // Gestion des événements
  const handleAddEvent = () => {
    if (newEvent.title && newEvent.date && newEvent.startTime && newEvent.endTime) {
      const newId = events.length > 0 ? Math.max(...events.map((e) => e.id)) + 1 : 1
      const updatedEvents = [
        ...events,
        {
          id: newId,
          title: newEvent.title,
          subject: newEvent.subject,
          date: newEvent.date,
          startTime: newEvent.startTime,
          endTime: newEvent.endTime,
          color: eventColors[newEvent.type],
          type: newEvent.type,
        },
      ]
      setEvents(updatedEvents)
      localStorage.setItem("events", JSON.stringify(updatedEvents))
      setNewEvent({
        title: "",
        subject: "",
        date: "",
        startTime: "09:00",
        endTime: "10:00",
        type: "revision",
      })
      setIsAddModalOpen(false)
    }
  }

  // Obtenir les événements pour une date donnée
  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split("T")[0]
    return events.filter((event) => event.date === dateString)
  }

  // Obtenir les événements pour un créneau horaire spécifique
  const getEventForTimeSlot = (date: Date, hour: number) => {
    const dateString = date.toISOString().split("T")[0]
    return events.find((event) => {
      if (event.date !== dateString) return false
      const eventHour = Number.parseInt(event.startTime.split(":")[0])
      return eventHour === hour
    })
  }

  const hours = Array.from({ length: 16 }, (_, i) => `${8 + i}:00`)

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <Button variant="outline" className="mb-6" onClick={() => router.push("/")}>Retour à l'accueil</Button>
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Emploi du temps</h1>
            </div>

            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter un événement
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Nouvel événement</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Titre</Label>
                    <Input
                      id="title"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="Ex: Révision Mathématiques"
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject">Matière (optionnel)</Label>
                    <Select
                      value={newEvent.subject}
                      onValueChange={(value) => setNewEvent((prev) => ({ ...prev, subject: value }))}
                    >
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
                  <div>
                    <Label htmlFor="type">Type d'événement</Label>
                    <Select
                      value={newEvent.type}
                      onValueChange={(value) =>
                        setNewEvent((prev) => ({ ...prev, type: value as keyof typeof eventColors }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="revision">📚 Révision</SelectItem>
                        <SelectItem value="cours">🎓 Cours</SelectItem>
                        <SelectItem value="examen">📝 Examen</SelectItem>
                        <SelectItem value="autre">📌 Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent((prev) => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startTime">Heure de début</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={newEvent.startTime}
                        onChange={(e) => setNewEvent((prev) => ({ ...prev, startTime: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endTime">Heure de fin</Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={newEvent.endTime}
                        onChange={(e) => setNewEvent((prev) => ({ ...prev, endTime: e.target.value }))}
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddEvent} className="w-full">
                    Créer l'événement
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* View Controls */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <Button
                  variant={viewMode === "week" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("week")}
                  className={viewMode === "week" ? "bg-blue-600 text-white" : ""}
                >
                  Semaine
                </Button>
                <Button
                  variant={viewMode === "month" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("month")}
                  className={viewMode === "month" ? "bg-blue-600 text-white" : ""}
                >
                  Mois
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => (viewMode === "week" ? navigateWeek("prev") : navigateMonth("prev"))}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="font-medium min-w-[150px] text-center">
                {viewMode === "week"
                  ? formatWeekRange(currentDate)
                  : currentDate.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => (viewMode === "week" ? navigateWeek("next") : navigateMonth("next"))}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                Aujourd'hui
              </Button>
            </div>
          </div>

          {/* Calendar Grid */}
          {viewMode === "week" && (
            <div className="bg-white rounded-lg border overflow-hidden shadow-sm">
              {/* Header */}
              <div className="grid grid-cols-8 border-b">
                <div className="p-4 bg-gray-50 border-r"></div>
                {weekDays.map((day) => (
                  <div
                    key={day.name}
                    className={`p-4 text-center font-medium border-r ${
                      day.isToday ? "bg-blue-600 text-white" : "bg-gray-50"
                    }`}
                  >
                    <div className="text-sm">{day.name}</div>
                    <div className={`text-lg ${day.isToday ? "font-bold" : ""}`}>{day.date}</div>
                  </div>
                ))}
              </div>

              {/* Time slots */}
              {hours.map((hour, hourIndex) => (
                <div key={hour} className="grid grid-cols-8 border-b">
                  <div className="p-4 text-sm text-gray-500 bg-gray-50 border-r font-medium">{hour}</div>
                  {weekDays.map((day) => {
                    const event = getEventForTimeSlot(day.fullDate, 8 + hourIndex)
                    return (
                      <div key={`${day.date}-${hour}`} className="p-2 border-r min-h-[80px] relative hover:bg-gray-50">
                        {event && (
                          <div
                            className={`absolute inset-2 rounded-lg p-2 text-white text-xs shadow-sm ${event.color}`}
                          >
                            <div className="font-medium truncate">{event.title}</div>
                            {event.subject && <div className="opacity-90 text-xs">{event.subject}</div>}
                            <div className="opacity-75 text-xs">
                              {event.startTime} - {event.endTime}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          )}

          {viewMode === "month" && (
            <div className="bg-white rounded-lg border overflow-hidden shadow-sm">
              {/* Month header */}
              <div className="grid grid-cols-7 border-b">
                {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => (
                  <div key={day} className="p-4 text-center font-medium bg-gray-50 border-r">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar days */}
              <div className="grid grid-cols-7">
                {monthDays.map((day, index) => {
                  const dayEvents = getEventsForDate(day.fullDate)
                  return (
                    <div
                      key={index}
                      className={`p-2 min-h-[120px] border-r border-b hover:bg-gray-50 ${
                        !day.isCurrentMonth ? "bg-gray-50" : ""
                      }`}
                    >
                      <div
                        className={`text-sm mb-2 ${
                          day.isToday
                            ? "bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold"
                            : day.isCurrentMonth
                              ? "font-medium"
                              : "text-gray-400"
                        }`}
                      >
                        {day.date}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 3).map((event) => (
                          <div
                            key={event.id}
                            className={`text-xs px-2 py-1 rounded truncate ${eventColorClasses[event.type as keyof typeof eventColorClasses]}`}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 3 && (
                          <div className="text-xs text-gray-500 px-2">+{dayEvents.length - 3} autres</div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
