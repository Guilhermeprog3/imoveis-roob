"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Home, LogOut, Settings, User, Key, Link as LinkIcon, Camera } from "lucide-react"
import Link from "next/link"

// Dados mockados diretamente na página
const mockBrokerData = {
    id: "genilson",
    name: "Genilson Silva Rios",
    creci: "CRECI-SP 123.456-F",
    phone: "(86) 99999-8888",
    email: "admin@imovelpro.com", // Usando o email de login para o mock
    specialties: ["Residencial", "Comercial"],
    experience: "8 anos de experiência",
    photo: "/professional-male-realtor-portrait.png",
    whatsapp: "5586999998888",
    facebook: "http://facebook.com/genilson.rios",
    instagram: "http://instagram.com/genilson.rios",
    facebookUsername: "genilson_corretor",
    instagramUsername: "genilson_corretor",
};


function SettingsPage() {
  const { user, logout } = useAuth()
  const [formData, setFormData] = useState(mockBrokerData)
  const [isLoading, setIsLoading] = useState(false)


  if (!formData) {
    return <div>Carregando dados do corretor...</div>
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => prev ? { ...prev, [field]: value } : prev)
  }

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    console.log("Salvando dados:", formData)
    // Simula uma chamada de API
    await new Promise(resolve => setTimeout(resolve, 1500))
    alert("Dados salvos com sucesso!")
    setIsLoading(false)
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary mb-2">Configurações da Conta</h1>
          <p className="text-muted-foreground">Gerencie suas informações pessoais e de contato.</p>
        </div>

        <form onSubmit={handleSaveChanges}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Coluna da Foto */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader className="text-center">
                  <CardTitle>Foto de Perfil</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <Avatar className="h-32 w-32 border-4 border-primary/20">
                      <AvatarImage src={formData.photo} alt={formData.name} />
                      <AvatarFallback>{formData.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <Button type="button" size="icon" className="absolute bottom-1 right-1 h-8 w-8 rounded-full">
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                   <p className="text-sm text-muted-foreground text-center">Clique na câmera para alterar sua foto.</p>
                </CardContent>
              </Card>
            </div>

            {/* Coluna de Informações */}
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><User className="h-5 w-5 text-primary" /> Dados Pessoais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input id="name" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" value={formData.email} disabled />
                    </div>
                  </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="phone">Telefone / WhatsApp</Label>
                      <Input id="phone" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} />
                    </div>
                     <div className="space-y-1">
                      <Label htmlFor="creci">CRECI</Label>
                      <Input id="creci" value={formData.creci} onChange={(e) => handleInputChange('creci', e.target.value)} />
                    </div>
                  </div>
                </CardContent>
              </Card>

               <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><LinkIcon className="h-5 w-5 text-primary" /> Redes Sociais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="facebookUsername">Usuário do Facebook</Label>
                      <Input id="facebookUsername" value={formData.facebookUsername} onChange={(e) => handleInputChange('facebookUsername', e.target.value)} placeholder="ex: seu.nome" />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="instagramUsername">Usuário do Instagram</Label>
                      <Input id="instagramUsername" value={formData.instagramUsername} onChange={(e) => handleInputChange('instagramUsername', e.target.value)} placeholder="ex: seu_nome" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button type="submit" size="lg" disabled={isLoading}>
                  {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}

export default function SettingsPageWrapper() {
  return (
    <ProtectedRoute>
      <SettingsPage />
    </ProtectedRoute>
  )
}