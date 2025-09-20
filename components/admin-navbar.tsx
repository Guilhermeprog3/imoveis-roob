"use client"

import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Home, LogOut } from "lucide-react"

export function AdminNavbar() {
  const { user, logout } = useAuth()

  return (
    <header className="bg-secondary text-secondary-foreground shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link href="/admin" className="flex items-center space-x-2 hover:text-primary transition-colors">
              <Home className="h-6 w-6" />
              <span className="text-xl font-bold">GR Imóveis</span>
            </Link>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary">
              Admin
            </Badge>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm">Olá, {user?.name}</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={logout}
              className="text-red-500 border-red-500/50 hover:bg-red-500 hover:text-white"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}