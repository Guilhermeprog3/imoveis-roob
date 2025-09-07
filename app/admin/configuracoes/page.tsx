"use client"
import { useState, useEffect, useRef } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Home, LogOut, Settings, User, Key, Link as LinkIcon, Camera, Loader2 } from "lucide-react"
import Link from "next/link"
import { db } from "@/firebase/config"
import { doc, getDoc, updateDoc } from "firebase/firestore"

interface BrokerFormData {
    nome: string;
    creci: string;
    phone: string;
    email: string;
    photo: string;
    facebookUsername: string;
    instagramUsername: string;
}

function SettingsPage() {
  const { user, logout } = useAuth()
  const [formData, setFormData] = useState<BrokerFormData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchBrokerData = async () => {
      if (user) {
        setIsFetching(true)
        const docRef = doc(db, "usuarios", user.uid)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setFormData(docSnap.data() as BrokerFormData)
        } else {
          console.log("Nenhum documento de usuário encontrado!");
        }
        setIsFetching(false)
      }
    }
    fetchBrokerData()
  }, [user])

  const handleInputChange = (field: keyof BrokerFormData, value: string) => {
    setFormData(prev => prev ? { ...prev, [field]: value } : null)
  }
  
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!)
    
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      )
      const data = await response.json()
      if (data.secure_url) {
        handleInputChange('photo', data.secure_url)
      }
    } catch (error) {
      console.error("Erro no upload da imagem:", error)
      alert("Falha ao enviar a imagem.")
    } finally {
      setIsUploading(false)
    }
  }


  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !formData) return

    setIsLoading(true)
    try {
      const userDocRef = doc(db, "usuarios", user.uid)
      await updateDoc(userDocRef, {
        ...formData,
        email: user.email 
      })
      alert("Dados salvos com sucesso!")
    } catch (error) {
      console.error("Erro ao salvar dados:", error)
      alert("Falha ao salvar as alterações.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return <div className="min-h-screen flex items-center justify-center">Carregando dados...</div>
  }

  if (!formData) {
    return <div className="min-h-screen flex items-center justify-center">Não foi possível carregar os dados do usuário.</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-secondary text-secondary-foreground shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2 hover:text-primary transition-colors">
                <Home className="h-6 w-6" />
                <span className="text-xl font-bold">GR Imóveis</span>
              </Link>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary">Admin</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="hover:text-primary transition-colors">Dashboard</Link>
              <Link href="/admin/imoveis" className="hover:text-primary transition-colors">Imóveis</Link>
              <span className="text-sm">Olá, {user?.name}</span>
              <Button variant="outline" size="sm" onClick={logout}><LogOut className="h-4 w-4 mr-2" />Sair</Button>
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
            <div className="lg:col-span-1">
              <Card>
                <CardHeader className="text-center"><CardTitle>Foto de Perfil</CardTitle></CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <Avatar className="h-32 w-32 border-4 border-primary/20">
                      <AvatarImage src={formData.photo} alt={formData.nome} />
                      <AvatarFallback>{formData.nome?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleImageUpload} 
                      className="hidden" 
                      accept="image/png, image/jpeg, image/webp"
                    />
                    <Button 
                      type="button" 
                      size="icon" 
                      className="absolute bottom-1 right-1 h-8 w-8 rounded-full" 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                    </Button>
                  </div>
                   <p className="text-sm text-muted-foreground text-center">Clique na câmera para alterar sua foto.</p>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><User className="h-5 w-5 text-primary" /> Dados Pessoais</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input id="name" value={formData.nome} onChange={(e) => handleInputChange('nome', e.target.value)} />
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
                <CardHeader><CardTitle className="flex items-center gap-2"><LinkIcon className="h-5 w-5 text-primary" /> Redes Sociais</CardTitle></CardHeader>
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
                <Button type="submit" size="lg" disabled={isLoading || isUploading}>
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