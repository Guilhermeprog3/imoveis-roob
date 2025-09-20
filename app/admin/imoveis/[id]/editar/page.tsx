"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/firebase/config"
import type { PropertyFormData } from "@/components/property-form"
import { ProtectedRoute } from "@/components/protected-route"
import { PropertyForm } from "@/components/property-form"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft, SearchX, Loader2 } from "lucide-react"
import Link from "next/link"
import { Footer } from "@/components/footer"
import { AdminNavbar } from "@/components/admin-navbar";

function EditPropertyPage() {
  const router = useRouter()
  const params = useParams()
  const propertyId = params.id as string
  const [propertyData, setPropertyData] = useState<PropertyFormData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!propertyId) return;

    const fetchProperty = async () => {
      setIsLoading(true);
      setNotFound(false);
      
      const docRef = doc(db, "imoveis", propertyId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setPropertyData({ id: docSnap.id, ...docSnap.data() } as unknown as PropertyFormData);
      } else {
        console.log("Documento não encontrado no Firestore!");
        setNotFound(true);
      }
      setIsLoading(false);
    };

    fetchProperty();
  }, [propertyId]);


  const handleSubmit = async (data: any) => {
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    console.log("Imóvel atualizado:", data)
    setIsSubmitting(false)
    router.push("/admin/imoveis")
  }

  const handleCancel = () => {
    router.push("/admin/imoveis")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col">
        <AdminNavbar />
        <main className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
          <div className="text-center max-w-lg">
            <div className="mx-auto bg-primary/10 p-6 rounded-full w-fit mb-8">
              <SearchX className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4">
              Imóvel Não Encontrado
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              O imóvel que você está procurando não existe ou o link expirou.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="h-12 text-base">
                <Link href="/admin/imoveis">
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
      <AdminNavbar />
      <main className="container mx-auto px-4 py-8">
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

        {propertyData && (
          <PropertyForm
            initialData={propertyData}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isSubmitting}
          />
        )}
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