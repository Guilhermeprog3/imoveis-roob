"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Menu, X, Home, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuth()

  return (
    <header className="bg-secondary text-secondary-foreground shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Home className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">GR Imóveis</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="hover:text-primary transition-colors">
              Início
            </Link>
            <Link href="/imoveis" className="hover:text-primary transition-colors">
              Imóveis
            </Link>
            {/* LINHA ADICIONADA ABAIXO */}
            <Link href="/sobre" className="hover:text-primary transition-colors">
              Sobre
            </Link>
            <Link href="/contato" className="hover:text-primary transition-colors">
              Contato
            </Link>
            {user ? (
              <div className="flex items-center space-x-4">
                <Link href="/admin" className="hover:text-primary transition-colors">
                  <User className="h-4 w-4 inline mr-1" />
                  Dashboard
                </Link>
                <Button size="sm" onClick={logout}>
                  <LogOut className="h-4 w-4 mr-1" />
                  Sair
                </Button>
              </div>
            ) : (
              <Link href="/admin/login" className="hover:text-primary transition-colors">
                <User className="h-4 w-4 inline mr-1" />
                Admin
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-secondary-foreground/20">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                Início
              </Link>
              <Link
                href="/imoveis"
                className="hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Imóveis
              </Link>
               {/* LINHA ADICIONADA ABAIXO */}
              <Link
                href="/sobre"
                className="hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Sobre
              </Link>
              <Link
                href="/contato"
                className="hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contato
              </Link>
              {user ? (
                <>
                  <Link
                    href="/admin"
                    className="hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-4 w-4 inline mr-1" />
                    Dashboard
                  </Link>
                  <button
                    className="text-left hover:text-primary transition-colors"
                    onClick={() => {
                      logout()
                      setIsMenuOpen(false)
                    }}
                  >
                    <LogOut className="h-4 w-4 inline mr-1" />
                    Sair
                  </button>
                </>
              ) : (
                <Link
                  href="/admin/login"
                  className="hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-4 w-4 inline mr-1" />
                  Admin
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}