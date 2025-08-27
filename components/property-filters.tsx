"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Filter, X } from "lucide-react"

interface FilterProps {
  onFilterChange: (filters: any) => void
}

export function PropertyFilters({ onFilterChange }: FilterProps) {
  const [filters, setFilters] = useState({
    search: "",
    type: "all",
    minPrice: "",
    maxPrice: "",
    location: "all",
    bedrooms: "any",
    bathrooms: "any",
    sortBy: "newest",
  })

  const [showFilters, setShowFilters] = useState(false)

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters = {
      search: "",
      type: "all",
      minPrice: "",
      maxPrice: "",
      location: "all",
      bedrooms: "any",
      bathrooms: "any",
      sortBy: "newest",
    }
    setFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
        <Input
          placeholder="Buscar por bairro, cidade ou características..."
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          className="pl-10 h-12"
        />
      </div>

      {/* Filter Toggle Button */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filtros Avançados
        </Button>

        <div className="flex items-center gap-4">
          <Label htmlFor="sort">Ordenar por:</Label>
          <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange("sortBy", value)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Mais Recentes</SelectItem>
              <SelectItem value="price-low">Menor Preço</SelectItem>
              <SelectItem value="price-high">Maior Preço</SelectItem>
              <SelectItem value="area-large">Maior Área</SelectItem>
              <SelectItem value="area-small">Menor Área</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Filtros Avançados</CardTitle>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-2" />
              Limpar Filtros
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Property Type */}
              <div className="space-y-2">
                <Label>Tipo de Imóvel</Label>
                <Select value={filters.type} onValueChange={(value) => handleFilterChange("type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    <SelectItem value="casa">Casa</SelectItem>
                    <SelectItem value="apartamento">Apartamento</SelectItem>
                    <SelectItem value="cobertura">Cobertura</SelectItem>
                    <SelectItem value="terreno">Terreno</SelectItem>
                    <SelectItem value="comercial">Comercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Cidade/Localização</Label>
                <Select value={filters.location} onValueChange={(value) => handleFilterChange("location", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas as cidades" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as cidades</SelectItem>
                    <SelectItem value="timon">Timon - MA</SelectItem>
                    <SelectItem value="teresina">Teresina - PI</SelectItem>
                    <SelectItem value="sao-luis">São Luís - MA</SelectItem>
                    <SelectItem value="parnaiba">Parnaíba - PI</SelectItem>
                    <SelectItem value="imperatriz">Imperatriz - MA</SelectItem>
                    <SelectItem value="floriano">Floriano - PI</SelectItem>
                    <SelectItem value="caxias">Caxias - MA</SelectItem>
                    <SelectItem value="picos">Picos - PI</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Bedrooms */}
              <div className="space-y-2">
                <Label>Quartos</Label>
                <Select value={filters.bedrooms} onValueChange={(value) => handleFilterChange("bedrooms", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Qualquer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Qualquer</SelectItem>
                    <SelectItem value="1">1+ quarto</SelectItem>
                    <SelectItem value="2">2+ quartos</SelectItem>
                    <SelectItem value="3">3+ quartos</SelectItem>
                    <SelectItem value="4">4+ quartos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Bathrooms */}
              <div className="space-y-2">
                <Label>Banheiros</Label>
                <Select value={filters.bathrooms} onValueChange={(value) => handleFilterChange("bathrooms", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Qualquer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Qualquer</SelectItem>
                    <SelectItem value="1">1+ banheiro</SelectItem>
                    <SelectItem value="2">2+ banheiros</SelectItem>
                    <SelectItem value="3">3+ banheiros</SelectItem>
                    <SelectItem value="4">4+ banheiros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <Label>Preço Mínimo</Label>
                <Input
                  type="number"
                  placeholder="R$ 0"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Preço Máximo</Label>
                <Input
                  type="number"
                  placeholder="R$ 999.999.999"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
