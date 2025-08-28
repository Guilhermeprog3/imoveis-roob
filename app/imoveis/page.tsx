"use client"

import { useState, useMemo } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PropertyFilters } from "@/components/property-filters"
import { PropertyCard } from "@/components/property-card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Mock data - será substituído por dados reais do banco
const allProperties = [
  {
    id: 1,
    title: "Casa Moderna com Piscina",
    price: "R$ 850.000",
    location: "Jardim das Flores",
    bedrooms: 4,
    bathrooms: 3,
    area: 280,
    type: "casa",
    status: "À Venda" as const,
    image: "/modern-house-with-pool.png",
    featured: true,
  },
  {
    id: 2,
    title: "Apartamento Luxuoso Centro",
    price: "R$ 3.500/mês",
    location: "Centro",
    bedrooms: 2,
    bathrooms: 2,
    area: 95,
    type: "apartamento",
    status: "Para Alugar" as const,
    image: "/luxury-apartment-interior.png",
    featured: true,
  },
  {
    id: 3,
    title: "Cobertura com Vista Panorâmica",
    price: "R$ 1.200.000",
    location: "Vila Madalena",
    bedrooms: 3,
    bathrooms: 3,
    area: 180,
    type: "cobertura",
    status: "À Venda" as const,
    image: "/penthouse-city-view.png",
    featured: true,
  },
  {
    id: 4,
    title: "Casa Familiar Espaçosa",
    price: "R$ 650.000",
    location: "Vila Nova",
    bedrooms: 3,
    bathrooms: 2,
    area: 220,
    type: "casa",
    status: "À Venda" as const,
    image: "/spacious-family-house.png",
  },
  {
    id: 5,
    title: "Apartamento Compacto Moderno",
    price: "R$ 2.200/mês",
    location: "Liberdade",
    bedrooms: 1,
    bathrooms: 1,
    area: 45,
    type: "apartamento",
    status: "Para Alugar" as const,
    image: "/modern-compact-apartment.png",
  },
  {
    id: 6,
    title: "Casa com Quintal Grande",
    price: "R$ 480.000",
    location: "Zona Norte",
    bedrooms: 2,
    bathrooms: 1,
    area: 150,
    type: "casa",
    status: "À Venda" as const,
    image: "/house-with-large-backyard.png",
  },
  {
    id: 7,
    title: "Apartamento de Alto Padrão",
    price: "R$ 1.800.000",
    location: "Jardins",
    bedrooms: 4,
    bathrooms: 4,
    area: 200,
    type: "apartamento",
    status: "À Venda" as const,
    image: "/luxury-high-end-apartment.png",
  },
  {
    id: 8,
    title: "Terreno Comercial",
    price: "R$ 2.500.000",
    location: "Avenida Principal",
    bedrooms: 0,
    bathrooms: 0,
    area: 500,
    type: "terreno",
    status: "À Venda" as const,
    image: "/commercial-land-plot.png",
  },
]

const ITEMS_PER_PAGE = 6

export default function ImoveisPage() {
  const [filters, setFilters] = useState({
    search: "",
    type: "",
    minPrice: "",
    maxPrice: "",
    location: "",
    bedrooms: "",
    bathrooms: "",
    minArea: "", // Adicionado estado para área
    sortBy: "newest",
  })
  const [currentPage, setCurrentPage] = useState(1)

  const filteredProperties = useMemo(() => {
    const filtered = allProperties.filter((property) => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        if (
          !property.title.toLowerCase().includes(searchTerm) &&
          !property.location.toLowerCase().includes(searchTerm)
        ) {
          return false
        }
      }

      // Type filter
      if (filters.type && filters.type !== "all" && property.type !== filters.type) {
        return false
      }

      // Bedrooms filter
      if (filters.bedrooms && filters.bedrooms !== "any" && property.bedrooms < Number.parseInt(filters.bedrooms)) {
        return false
      }

      // Bathrooms filter
      if (filters.bathrooms && filters.bathrooms !== "any" && property.bathrooms < Number.parseInt(filters.bathrooms)) {
        return false
      }

      // Price filter (simplified - in real app would need proper price parsing)
      if (filters.minPrice || filters.maxPrice) {
        const priceValue = Number.parseInt(property.price.replace(/[^\d]/g, ""))
        if (filters.minPrice && priceValue < Number.parseInt(filters.minPrice)) {
          return false
        }
        if (filters.maxPrice && priceValue > Number.parseInt(filters.maxPrice)) {
          return false
        }
      }
      
      // FILTRO DE ÁREA ADICIONADO
      if (filters.minArea && property.area < Number.parseInt(filters.minArea)) {
        return false
      }

      return true
    })

    // Sort properties
    switch (filters.sortBy) {
      case "price-low":
        filtered.sort((a, b) => {
          const priceA = Number.parseInt(a.price.replace(/[^\d]/g, ""))
          const priceB = Number.parseInt(b.price.replace(/[^\d]/g, ""))
          return priceA - priceB
        })
        break
      case "price-high":
        filtered.sort((a, b) => {
          const priceA = Number.parseInt(a.price.replace(/[^\d]/g, ""))
          const priceB = Number.parseInt(b.price.replace(/[^\d]/g, ""))
          return priceB - priceA
        })
        break
      case "area-large":
        filtered.sort((a, b) => b.area - a.area)
        break
      case "area-small":
        filtered.sort((a, b) => a.area - b.area)
        break
      default:
        // newest - keep original order
        break
    }

    return filtered
  }, [filters])

  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedProperties = filteredProperties.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters)
    setCurrentPage(1) // Reset to first page when filters change
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-4">Todos os Imóveis</h1>
          <p className="text-lg text-muted-foreground">
            Encontre o imóvel perfeito para você. {filteredProperties.length} imóveis encontrados.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <PropertyFilters onFilterChange={handleFilterChange} />
        </div>

        {/* Results */}
        {paginatedProperties.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {paginatedProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Anterior
                </Button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={page === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Próxima
                  <ChevronRight className="h-4 w-4 ml-2" />
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
                  search: "",
                  type: "",
                  minPrice: "",
                  maxPrice: "",
                  location: "",
                  bedrooms: "",
                  bathrooms: "",
                  minArea: "",
                  sortBy: "newest",
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