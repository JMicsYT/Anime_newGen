"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, Star, Sparkles } from "lucide-react"
import { EditProfileDialog } from "@/components/edit-profile-dialog"

export function UserProfile() {
  const [username, setUsername] = useState("Пользователь")
  const [avatarUrl, setAvatarUrl] = useState("")

  const handleSaveProfile = (newUsername: string, newAvatar: string) => {
    setUsername(newUsername)
    if (newAvatar) {
      setAvatarUrl(newAvatar)
    }
  }

  // Mock gallery data
  const galleryImages = [
    { id: 1, query: "anime girl with pink hair in cherry blossom garden" },
    { id: 2, query: "cute anime cat with magical powers" },
    { id: 3, query: "anime boy with blue eyes under starry sky" },
    { id: 4, query: "magical anime girl with butterfly wings" },
    { id: 5, query: "anime character with purple hair and flowers" },
    { id: 6, query: "cute anime mascot character kawaii style" },
  ]

  return (
    <div className="w-full max-w-6xl">
      {/* Profile header */}
      <Card className="p-8 mb-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-4 border-pink-300 dark:border-cyan-500/50 shadow-2xl relative overflow-hidden rounded-3xl transition-colors duration-300">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-300 to-purple-300 dark:from-cyan-500/30 dark:to-purple-600/30 rounded-bl-full opacity-30" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-300 to-pink-300 dark:from-blue-600/30 dark:to-purple-700/30 rounded-tr-full opacity-20" />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 mb-6">
          <div className="relative">
            <Avatar className="w-24 h-24 border-4 border-purple-300 dark:border-cyan-500 shadow-xl">
              <AvatarImage src={avatarUrl || "/placeholder.svg?height=96&width=96"} />
              <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-400 dark:from-cyan-500 dark:to-purple-600 text-white text-2xl font-bold">
                {username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2 bg-pink-500 dark:bg-cyan-500 rounded-full p-2 shadow-lg">
              <Heart className="w-4 h-4 text-white fill-white" />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 dark:from-cyan-400 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
              {username}
            </h1>
            <p className="text-purple-600 dark:text-cyan-300 font-medium flex items-center gap-2 justify-center md:justify-start">
              <Star className="w-4 h-4 text-yellow-400 dark:text-cyan-400 fill-yellow-400 dark:fill-cyan-400" />
              Уровень: Мастер Магии
              <Sparkles className="w-4 h-4 text-purple-400 dark:text-cyan-400" />
            </p>
          </div>
        </div>

        <div className="relative z-10 flex justify-center md:justify-end">
          <EditProfileDialog currentUsername={username} onSave={handleSaveProfile} />
        </div>
      </Card>

      {/* Gallery */}
      <Card className="p-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-4 border-purple-300 dark:border-purple-600/50 shadow-2xl rounded-3xl transition-colors duration-300">
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="w-8 h-8 text-purple-500 dark:text-cyan-400" />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 dark:from-cyan-400 dark:to-purple-400 bg-clip-text text-transparent">
            Галерея Изображений
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image) => (
            <div
              key={image.id}
              className="group relative aspect-square rounded-3xl overflow-hidden border-4 border-pink-200 dark:border-purple-700/50 hover:border-purple-400 dark:hover:border-cyan-400 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <img
                src={`/placeholder.svg?height=400&width=400&query=${encodeURIComponent(image.query)}`}
                alt={`Gallery image ${image.id}`}
                className="w-full h-full object-cover"
              />

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-purple-600/80 dark:from-cyan-600/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <div className="text-white font-semibold flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  <span>Изображение #{image.id}</span>
                </div>
              </div>

              {/* Decorative corner */}
              <div className="absolute top-2 right-2 bg-pink-400 dark:bg-cyan-500 rounded-full p-1.5 opacity-80 shadow-lg">
                <Star className="w-3 h-3 text-white fill-white" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
