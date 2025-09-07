// app/admin/imoveis/novo/page.tsx
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
import { db, storage } from "@/firebase/config";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

function NewPropertyPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      // 1. Fazer o upload das imagens para o Firebase Storage
      const imageUrls = await Promise.all(
        data.images.map(async (image: string, index: number) => {
          if (image.startsWith("data:image")) { // Verifica se é uma imagem em base64
            const storageRef = ref(storage, `imoveis/${Date.now()}_${index}`);
            const uploadResult = await uploadString(storageRef, image, 'data_url');
            return getDownloadURL(uploadResult.ref);
          }
          return image; // Mantém a URL se já for uma
        })
      );

      // 2. Salvar os dados do imóvel (com as URLs das imagens) no Firestore
      await addDoc(collection(db, "imoveis"), {
        ...data,
        images: imageUrls,
        createdAt: new Date().toISOString(), // Adiciona um timestamp
      });

      // 3. Redirecionar para a página de gerenciamento
      router.push("/admin/imoveis");
    } catch (error) {
      console.error("Erro ao adicionar imóvel: ", error);
      // Aqui você pode adicionar um toast de erro para o usuário
    } finally {
      setIsLoading(false);
    }
  };


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