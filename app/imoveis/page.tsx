"use client"

import { useState, useMemo, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PropertyFilters } from "@/components/property-filters"
import { PropertyCard } from "@/components/property-card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { db } from "@/firebase/config"
import { collection, getDocs, query, where, orderBy } from "firebase/firestore"

interface PropertyFromDB {
  id: string;
  title: string;
  price: number;
  bairro: string;
  cidade: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: string;
  status: "disponivel" | "vendido" | "alugado" | "indisponivel";
  images: string[];
  featured?: boolean;
  createdAt: string;
}

interface PropertyForCard {
    id: string;
    title: string;
    price: string;
    location: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
    type: string;
    status: "À Venda" | "Para Alugar" | "Vendido" | "Alugado";
    image: string;
    featured?: boolean;
}


const ITEMS_PER_PAGE = 6

export default function ImoveisPage() {
  const [allProperties, setAllProperties] = useState<PropertyFromDB[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    searchTerm: "",
    type: "all",
    cidade: "all",
    bairro: "",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    sortBy: "newest",
  })
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true)
      try {
        const q = query(
            collection(db, "imoveis"), 
            where("status", "==", "disponivel"), 
            orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q)
        const propertiesData = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                title: data.title || "",
                price: Number(data.price) || 0,
                bairro: data.bairro || "",
                cidade: data.cidade || "",
                bedrooms: data.bedrooms || 0,
                bathrooms: data.bathrooms || 0,
                area: data.area || 0,
                type: data.type || "",
                status: data.status || "indisponivel",
                images: data.images || [],
                featured: data.featured || false,
                createdAt: data.createdAt || "",
            } as PropertyFromDB;
        });
        setAllProperties(propertiesData)
      } catch (error) {
        console.error("Erro ao buscar imóveis:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProperties()
  }, [])

  const filteredProperties = useMemo(() => {
    const { searchTerm, type, cidade, bairro, minPrice, maxPrice, bedrooms, bathrooms, area, sortBy } = filters
    
    let filtered = allProperties.filter((property) => {
      const propertyPrice = property.price || 0;
      const propertyArea = property.area || 0;
      
      const matchesSearch =
        (property.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (property.bairro?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (property.cidade?.toLowerCase() || '').includes(searchTerm.toLowerCase())
      const matchesType = type === "all" || (property.type?.toLowerCase() || '') === type
      const matchesCidade = cidade === "all" || property.cidade === cidade
      const matchesBairro = !bairro || (property.bairro?.toLowerCase() || '').includes(bairro.toLowerCase())
      const matchesMinPrice = !minPrice || propertyPrice >= parseInt(minPrice)
      const matchesMaxPrice = !maxPrice || propertyPrice <= parseInt(maxPrice)
      const matchesBedrooms = !bedrooms || property.bedrooms >= parseInt(bedrooms)
      const matchesBathrooms = !bathrooms || property.bathrooms >= parseInt(bathrooms)
      const matchesArea = !area || propertyArea >= parseInt(area)

      return matchesSearch && matchesType && matchesCidade && matchesBairro && matchesMinPrice && matchesMaxPrice && matchesBedrooms && matchesBathrooms && matchesArea
    });

    switch (sortBy) {
        case "price-low":
            filtered.sort((a, b) => a.price - b.price);
            break;
        case "price-high":
            filtered.sort((a, b) => b.price - a.price);
            break;
        case "area-large":
            filtered.sort((a, b) => b.area - a.area);
            break;
        case "area-small":
            filtered.sort((a, b) => a.area - b.area);
            break;
        case "newest":
        default:
            filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            break;
    }
    return filtered
  }, [allProperties, filters])

  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedProperties = filteredProperties.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }
  
  const adaptPropertyForCard = (property: PropertyFromDB): PropertyForCard => {
    let statusForCard: PropertyForCard['status'] = "À Venda";
    if (property.status === 'alugado') {
        statusForCard = "Alugado";
    }

    const formattedPrice = new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(property.price || 0);

    return {
      ...property,
      price: formattedPrice,
      location: `${property.bairro}, ${property.cidade}`,
      image: property.images?.[0] || '/placeholder.svg',
      status: statusForCard,
    };
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-4">Todos os Imóveis</h1>
          <p className="text-lg text-muted-foreground">
            Encontre o imóvel perfeito para você. {filteredProperties.length} imóveis encontrados.
          </p>
        </div>
        <div className="mb-8">
          <PropertyFilters onFilterChange={handleFilterChange} />
        </div>
        {isLoading ? (
            <div className="flex justify-center items-center py-24">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        ) : paginatedProperties.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {paginatedProperties.map((property) => (
                <PropertyCard key={property.id} property={adaptPropertyForCard(property)} />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4">
                <Button variant="outline" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>
                  <ChevronLeft className="h-4 w-4 mr-2" /> Anterior
                </Button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button key={page} variant={page === currentPage ? "default" : "outline"} size="sm" onClick={() => setCurrentPage(page)}>
                      {page}
                    </Button>
                  ))}
                </div>
                <Button variant="outline" onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>
                  Próxima <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-secondary mb-2">Nenhum imóvel encontrado</h3>
            <p className="text-muted-foreground mb-4">Tente ajustar os filtros para encontrar mais opções.</p>
            <Button
              onClick={() =>
                handleFilterChange({
                  searchTerm: "", type: "all", cidade: "all", bairro: "",
                  minPrice: "", maxPrice: "", bedrooms: "", bathrooms: "", area: "", sortBy: "newest"
                })
              }
            >
              Limpar Filtros
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}