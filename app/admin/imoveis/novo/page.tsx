// app/admin/imoveis/novo/page.tsx
"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { PropertyForm } from "@/components/property-form"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Home, LogOut, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { db } from "@/firebase/config";
import { collection, addDoc } from "firebase/firestore";

function NewPropertyPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(""); // Estado para a mensagem de erro

  const handleSubmit = async (data: any) => {
    // --- INÍCIO DA VALIDAÇÃO ---
    if (!data.title || !data.description || !data.type || !data.status || !data.cidade) {
      setError("Por favor, preencha todos os campos obrigatórios: Título, Descrição, Tipo, Status e Cidade.");
      return; // Interrompe a execução se a validação falhar
    }
    // --- FIM DA VALIDAÇÃO ---

    setIsLoading(true);
    setError(""); // Limpa o erro se a validação passar
    try {
      // 1. Fazer o upload das imagens para o Cloudinary
      const imageUrls = await Promise.all(
        data.images.map(async (image: string) => {
          if (image.startsWith("data:image")) {
            const formData = new FormData();
            formData.append('file', image);
            formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

            const response = await fetch(
              `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
              {
                method: 'POST',
                body: formData,
              }
            );

            const result = await response.json();
            if (result.secure_url) {
              return result.secure_url;
            }
            return null;
          }
          return image;
        })
      );

      const validImageUrls = imageUrls.filter(url => url !== null);

      // 2. Salvar os dados do imóvel no Firestore
      await addDoc(collection(db, "imoveis"), {
        ...data,
        images: validImageUrls,
        createdAt: new Date().toISOString(),
      });

      // 3. Redirecionar
      router.push("/admin/imoveis");
    } catch (error) {
      console.error("Erro ao adicionar imóvel: ", error);
      setError("Ocorreu um erro ao salvar o imóvel. Tente novamente.");
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

        {/* Mensagem de Erro */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

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