"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Star, Loader2 } from "lucide-react"
import Link from "next/link"
import { db } from "@/firebase/config"
import { collection, query, where, getDocs, limit } from "firebase/firestore"
import { PropertyCard } from "./property-card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface Property {
  id: string;
  title: string;
  price: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  status: "À Venda" | "Para Alugar" | "Vendido" | "Alugado";
  images: string[];
  featured: boolean;
  type: string;
  image: string;
}

export function FeaturedProperties() {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      setIsLoading(true)
      try {
        const propertiesRef = collection(db, "imoveis")
        const q = query(propertiesRef, where("featured", "==", true), limit(6))
        
        const querySnapshot = await getDocs(q)
        const propertiesData = querySnapshot.docs.map(doc => {
            const data = doc.data();
            const price = data.price ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.price) : "Consulte";
            return {
              id: doc.id,
              title: data.title || "",
              price: price,
              location: `${data.bairro || ''}, ${data.cidade || ''}`,
              bedrooms: data.bedrooms || 0,
              bathrooms: data.bathrooms || 0,
              area: data.area || 0,
              status: data.status === 'disponivel' ? 'À Venda' : 'Vendido',
              images: data.images || [],
              image: data.images?.[0] || "/placeholder.svg",
              featured: data.featured || false,
              type: data.type || ""
            } as Property;
        });
        
        setFeaturedProperties(propertiesData)
      } catch (error) {
        console.error("Erro ao buscar imóveis em destaque:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeaturedProperties()
  }, [])

  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
            <Star className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">Seleção Premium</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-secondary leading-tight">
            Imóveis em <span className="text-primary">Destaque</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            Selecionamos cuidadosamente os melhores imóveis para você. Confira nossas oportunidades exclusivas com
            localização privilegiada e acabamento de primeira qualidade.
          </p>
        </div>
        
        {isLoading ? (
            <div className="flex justify-center items-center py-16">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        ) : featuredProperties.length === 0 ? (
            <div className="text-center py-16">
                <p className="text-lg text-muted-foreground">Nenhum imóvel em destaque no momento.</p>
            </div>
        ) : (
          <Carousel
            opts={{
              align: "start",
              loop: featuredProperties.length > 3,
            }}
            className="w-full mb-16"
          >
            <CarouselContent className="-ml-4">
              {featuredProperties.map((property) => (
                <CarouselItem key={property.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="h-full">
                    <PropertyCard property={property} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-[-20px] top-1/2 -translate-y-1/2 hidden sm:flex" />
            <CarouselNext className="absolute right-[-20px] top-1/2 -translate-y-1/2 hidden sm:flex" />
          </Carousel>
        )}

        <div className="text-center">
          <Button
            asChild
            variant="outline"
            size="lg"           
            className="text-lg px-10 py-4 h-auto rounded-xl border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 bg-transparent"
          >
            <Link href="/imoveis">Explorar Todos os Imóveis</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}