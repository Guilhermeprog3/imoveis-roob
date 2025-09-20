"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { PropertyForm } from "@/components/property-form"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { db } from "@/firebase/config";
import { collection, addDoc } from "firebase/firestore";
import { AdminNavbar } from "@/components/admin-navbar";

function NewPropertyPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("");

  const handleSubmit = async (data: any) => {
    if (!data.title || !data.description || !data.type || !data.status || !data.cidade) {
      setError("Por favor, preencha todos os campos obrigatórios: Título, Descrição, Tipo, Status e Cidade.");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
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
      
      const priceAsNumber = data.price ? parseFloat(data.price.replace(/[^0-9,]/g, '').replace(',', '.')) : 0;
      const areaAsNumber = data.area ? parseInt(data.area.replace(/[^0-9]/g, '')) : 0;


      await addDoc(collection(db, "imoveis"), {
        ...data,
        price: priceAsNumber,
        area: areaAsNumber, 
        images: validImageUrls,
        createdAt: new Date().toISOString(),
      });

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
      <AdminNavbar />

      <main className="container mx-auto px-4 py-8">
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

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

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