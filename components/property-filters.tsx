"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Search, Filter, X } from "lucide-react"

interface FilterProps {
  onFilterChange: (filters: any) => void
}

const formatCurrencyForFilter = (value: string) => {
  if (!value) return ""
  let numberValue = parseInt(value.replace(/[^0-9]/g, ''), 10)
  if (isNaN(numberValue)) return ""
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(numberValue / 100)
}

const formatAreaForFilter = (value: string) => {
    if (!value) return ""
    const numberValue = value.replace(/[^0-9]/g, '')
    return numberValue ? `${numberValue} m²` : ""
}

export function PropertyFilters({ onFilterChange }: FilterProps) {
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

  const [displayFilters, setDisplayFilters] = useState({
    minPrice: "",
    maxPrice: "",
    area: "",
  });

  const [showFilters, setShowFilters] = useState(false)

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleFormattedInputChange = (key: 'minPrice' | 'maxPrice' | 'area', value: string) => {
    let formattedDisplay = '';
    const rawNumericString = value.replace(/[^0-9]/g, '');
    let finalNumericValue = rawNumericString;

    if (key === 'minPrice' || key === 'maxPrice') {
        formattedDisplay = formatCurrencyForFilter(value);
        const numberInCents = parseInt(rawNumericString, 10);
        if (!isNaN(numberInCents)) {
            finalNumericValue = String(Math.floor(numberInCents / 100));
        } else {
            finalNumericValue = "";
        }
    } else if (key === 'area') {
        formattedDisplay = formatAreaForFilter(value);
        finalNumericValue = rawNumericString;
    }
    
    setDisplayFilters(prev => ({ ...prev, [key]: formattedDisplay }));
    handleFilterChange(key, finalNumericValue);
  };

  const clearFilters = () => {
    const clearedFilters = {
        searchTerm: "", type: "all", cidade: "all", bairro: "",
        minPrice: "", maxPrice: "", bedrooms: "", bathrooms: "", area: "", sortBy: "newest"
    }
    setFilters(clearedFilters)
    setDisplayFilters({minPrice: "", maxPrice: "", area: ""});
    onFilterChange(clearedFilters)
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
        <Input
          placeholder="Buscar por título, bairro, cidade..."
          value={filters.searchTerm}
          onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
          className="pl-10 h-12"
        />
      </div>

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

      {showFilters && (
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Filtros Avançados</CardTitle>
              <CardDescription>Refine sua busca para encontrar imóveis específicos.</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-2" />
              Limpar Filtros
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Select value={filters.type} onValueChange={(value) => handleFilterChange("type", value)}>
                <SelectTrigger><SelectValue placeholder="Tipo" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Tipos</SelectItem>
                  <SelectItem value="casa">Casa</SelectItem>
                  <SelectItem value="apartamento">Apartamento</SelectItem>
                  <SelectItem value="cobertura">Cobertura</SelectItem>
                  <SelectItem value="terreno">Terreno</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filters.cidade} onValueChange={(value) => handleFilterChange("cidade", value)}>
                <SelectTrigger><SelectValue placeholder="Cidade" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Cidades</SelectItem>
                  <SelectItem value="Teresina">Teresina</SelectItem>
                  <SelectItem value="Timon">Timon</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="Bairro" value={filters.bairro} onChange={(e) => handleFilterChange("bairro", e.target.value)} />
              <Input type="text" placeholder="Preço Mín." value={displayFilters.minPrice} onChange={(e) => handleFormattedInputChange("minPrice", e.target.value)} />
              <Input type="text" placeholder="Preço Máx." value={displayFilters.maxPrice} onChange={(e) => handleFormattedInputChange("maxPrice", e.target.value)} />
              <Input type="number" placeholder="Quartos (mín.)" value={filters.bedrooms} onChange={(e) => handleFilterChange("bedrooms", e.target.value)} />
              <Input type="number" placeholder="Banheiros (mín.)" value={filters.bathrooms} onChange={(e) => handleFilterChange("bathrooms", e.target.value)} />
              <Input type="text" placeholder="Área (m² mín.)" value={displayFilters.area} onChange={(e) => handleFormattedInputChange("area", e.target.value)} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}