"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { PropertyForm } from "@/components/property-form"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Home, LogOut, ArrowLeft, SearchX } from "lucide-react"
import Link from "next/link"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"

// Mock de dados atualizado com os novos campos
const mockProperties = {
  1: {
    id: 1,
    title: "Casa Moderna com Piscina",
    price: "R$ 850.000",
    bairro: "Jardim das Flores",
    cidade: "Teresina",
    bedrooms: 4,
    suites: 2, // Novo campo
    closets: 1, // Novo campo
    bathrooms: 3,
    area: 280,
    garageSpaces: 2,
    type: "casa",
    status: "disponivel",
    featured: true,
    description: "Descrição da casa moderna...",
    images: ["/modern-house-with-pool.png"],
    features: ["Piscina", "Jardim"],
  },
  // Adicione outros imóveis aqui se necessário
}

function EditPropertyPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const params = useParams()
  const propertyId = params.id as string
  const [isLoading, setIsLoading] = useState(false)

  // Em uma aplicação real, você faria um fetch dos dados do imóvel aqui
  const propertyData = mockProperties[propertyId as unknown as keyof typeof mockProperties]

  const handleSubmit = async (data: any) => {
    setIsLoading(true)
    // Simula uma chamada de API para salvar os dados
    await new Promise((resolve) => setTimeout(resolve, 2000))
    console.log("Imóvel atualizado:", data)
    setIsLoading(false)
    router.push("/admin/imoveis")
  }

  const handleCancel = () => {
    router.push("/admin/imoveis")
  }

  if (!propertyData) {
    return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="text-center max-w-lg">
          <div className="mx-auto bg-primary/10 p-6 rounded-full w-fit mb-8">
            <SearchX className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4">
            Imóvel Não Encontrado
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            O imóvel que você está procurando não existe, foi vendido ou o link expirou. Que tal começar uma nova busca?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="h-12 text-base">
              <Link href="admin/imoveis">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Ver Todos os Imóveis
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 text-base bg-transparent">
              <Link href="/admin">
                <Home className="h-5 w-5 mr-2" />
                Página Inicial
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
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
                <span className="text-xl font-bold">GR Imóveis</span>
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

          <h1 className="text-3xl font-bold text-secondary mb-2">Editar Imóvel</h1>
          <p className="text-muted-foreground">Altere as informações do imóvel</p>
        </div>

        {/* Property Form */}
        <PropertyForm
          initialData={propertyData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </main>
    </div>
  )
}

export default function EditPropertyPageWrapper() {
  return (
    <ProtectedRoute>
      <EditPropertyPage />
    </ProtectedRoute>
  )
}