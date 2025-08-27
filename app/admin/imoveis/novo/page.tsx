"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { PropertyForm } from "@/components/property-form"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Home, LogOut, ArrowLeft } from "lucide-react"
import Link from "next/link"

function NewPropertyPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (data: any) => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("Novo imóvel:", data)

    // In a real app, you would save to database here
    setIsLoading(false)
    router.push("/admin/imoveis")
  }

  const handleCancel = () => {
    router.push("/admin/imoveis")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-secondary text-secondary-foreground shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2 hover:text-primary transition-colors">
                <Home className="h-6 w-6" />
                <span className="text-xl font-bold">ImóvelPro</span>
              </Link>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary">
                Admin
              </Badge>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/admin" className="hover:text-primary transition-colors">
                Dashboard
              </Link>
              <Link href="/admin/imoveis" className="hover:text-primary transition-colors">
                Imóveis
              </Link>
              <span className="text-sm">Olá, {user?.name}</span>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <Button variant="outline" asChild className="mb-4 bg-transparent">
            <Link href="/admin/imoveis">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Lista
            </Link>
          </Button>

          <h1 className="text-3xl font-bold text-secondary mb-2">Adicionar Novo Imóvel</h1>
          <p className="text-muted-foreground">Preencha as informações do imóvel</p>
        </div>

        {/* Property Form */}
        <PropertyForm onSubmit={handleSubmit} onCancel={handleCancel} isLoading={isLoading} />
      </main>
    </div>
  )
}

export default function NewPropertyPageWrapper() {
  return (
    <ProtectedRoute>
      <NewPropertyPage />
    </ProtectedRoute>
  )
}
