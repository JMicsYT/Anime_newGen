"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil, Sparkles, Upload } from "lucide-react"

interface EditProfileDialogProps {
  currentUsername: string
  onSave: (username: string, avatar: string) => void
}

export function EditProfileDialog({ currentUsername, onSave }: EditProfileDialogProps) {
  const [username, setUsername] = useState(currentUsername)
  const [avatar, setAvatar] = useState("")
  const [open, setOpen] = useState(false)

  const handleSave = () => {
    onSave(username, avatar)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 dark:from-cyan-500 dark:via-purple-600 dark:to-blue-600 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 dark:hover:from-cyan-400 dark:hover:via-purple-500 dark:hover:to-blue-500 text-white font-bold px-6 py-6 shadow-xl hover:shadow-2xl transition-all hover:scale-105 border-4 border-white dark:border-cyan-400/30">
          <Pencil className="w-5 h-5 mr-2" />
          Редактировать профиль
          <Sparkles className="w-4 h-4 ml-2" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-pink-50 to-purple-50 dark:from-slate-900 dark:to-purple-950 border-4 border-purple-300 dark:border-cyan-500/50 rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 dark:from-cyan-400 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-500 dark:text-cyan-400" />
            Редактировать профиль
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Username field */}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-purple-700 dark:text-cyan-300 font-semibold">
              Имя пользователя
            </Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="rounded-2xl border-3 border-pink-300 dark:border-cyan-500/50 focus:border-purple-500 dark:focus:border-cyan-400 bg-white dark:bg-slate-800/50 text-purple-900 dark:text-cyan-50"
              placeholder="Введите имя..."
            />
          </div>

          {/* Avatar URL field */}
          <div className="space-y-2">
            <Label
              htmlFor="avatar"
              className="text-purple-700 dark:text-cyan-300 font-semibold flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              URL аватара
            </Label>
            <Input
              id="avatar"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="rounded-2xl border-3 border-pink-300 dark:border-cyan-500/50 focus:border-purple-500 dark:focus:border-cyan-400 bg-white dark:bg-slate-800/50 text-purple-900 dark:text-cyan-50"
              placeholder="https://example.com/avatar.jpg"
            />
          </div>

          {/* Save button */}
          <Button
            onClick={handleSave}
            className="w-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 dark:from-cyan-500 dark:to-purple-600 hover:from-purple-600 hover:to-pink-600 dark:hover:from-cyan-400 dark:hover:to-purple-500 text-white font-bold py-6 shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Сохранить изменения
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
