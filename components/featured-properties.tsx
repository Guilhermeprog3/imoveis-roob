"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Bed, Bath, Square, Star, Loader2 } from "lucide-react"
import Link from "next/link"
import { db } from "@/firebase/config"
import { collection, query, where, getDocs, limit } from "firebase/firestore"

interface Property {
  id: string;
  title: string;
  price: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  status: "À Venda" | "Para Alugar";
  images: string[];
  featured: boolean;
}

export function FeaturedProperties() {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      setIsLoading(true)
      try {
        const propertiesRef = collection(db, "imoveis")
        const q = query(propertiesRef, where("featured", "==", true), limit(3))
        
        const querySnapshot = await getDocs(q)
        const propertiesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Property))
        
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
    <section className="py-20 bg-slate-50">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {featuredProperties.map((property, index) => (
                <Card
                  key={property.id}
                  className={`overflow-hidden transition-all duration-300 group bg-card border hover:shadow-xl hover:-translate-y-2 ${index === 0 && featuredProperties.length > 1 ? "lg:col-span-2" : ""}`}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={property.images?.[0] || "/placeholder.svg"}
                      alt={property.title}
                      className={`w-full object-cover group-hover:scale-110 transition-transform duration-700 ${
                        index === 0 && featuredProperties.length > 1 ? "h-80" : "h-64"
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <div className="absolute top-4 left-4">
                      <Badge
                        variant={property.status === "À Venda" ? "default" : "secondary"}
                        className={`${property.status === "À Venda" ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"} shadow-lg`}
                      >
                        {property.status}
                      </Badge>
                    </div>

                    {property.featured && (
                      <div className="absolute bottom-4 left-4">
                        <Badge className="bg-secondary text-secondary-foreground shadow-lg">
                          <Star className="h-3 w-3 mr-1" />
                          Destaque
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-secondary group-hover:text-primary transition-colors duration-300">
                      {property.title}
                    </h3>

                    <div className="flex items-center text-muted-foreground mb-4 text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-primary" />
                      <span>{property.location}</span>
                    </div>

                    <div className="flex items-center justify-around mb-4 text-muted-foreground border-t border-b py-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Bed className="h-4 w-4 mr-2" />
                        <span className="font-medium">{property.bedrooms}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Bath className="h-4 w-4 mr-2" />
                        <span className="font-medium">{property.bathrooms}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Square className="h-4 w-4 mr-2" />
                        <span className="font-medium">{property.area}m²</span>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-primary">{property.price}</div>
                  </CardContent>

                  <CardFooter className="p-6 pt-0">
                    <Button
                      asChild
                      className="w-full h-12 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Link href={`/imoveis/${property.id}`}>Ver Detalhes Completos</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
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