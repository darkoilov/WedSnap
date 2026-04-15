"use client"

import * as React from "react"
import { toast } from "sonner"

interface FavoritesContextType {
  favorites: Set<string>
  toggleFavorite: (id: string) => void
  isFavorite: (id: string) => boolean
  favoritesCount: number
  clearFavorites: () => void
}

const FavoritesContext = React.createContext<FavoritesContextType | undefined>(undefined)

const STORAGE_KEY = "wedsnap-favorites"

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = React.useState<Set<string>>(new Set())
  const [mounted, setMounted] = React.useState(false)

  // Load from localStorage on mount
  React.useEffect(() => {
    setMounted(true)
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setFavorites(new Set(JSON.parse(stored)))
      }
    } catch (e) {
      console.error("Failed to load favorites:", e)
    }
  }, [])

  // Save to localStorage on change
  React.useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...favorites]))
      } catch (e) {
        console.error("Failed to save favorites:", e)
      }
    }
  }, [favorites, mounted])

  const toggleFavorite = React.useCallback((id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
        toast.success("Отстрането од омилени")
      } else {
        next.add(id)
        toast.success("Додадено во омилени")
      }
      return next
    })
  }, [])

  const isFavorite = React.useCallback((id: string) => {
    return favorites.has(id)
  }, [favorites])

  const clearFavorites = React.useCallback(() => {
    setFavorites(new Set())
    toast.success("Сите омилени се избришани")
  }, [])

  return (
    <FavoritesContext.Provider 
      value={{ 
        favorites, 
        toggleFavorite, 
        isFavorite, 
        favoritesCount: favorites.size,
        clearFavorites 
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = React.useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider")
  }
  return context
}
