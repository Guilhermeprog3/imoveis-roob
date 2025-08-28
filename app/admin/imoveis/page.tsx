"use client"

import { useState, useMemo } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Home, LogOut, Plus, Search, Edit, Trash2, Eye, Star, Filter, X } from "lucide-react"
import Link from "next/link"

// Mock data atualizado com mais detalhes para os filtros
const mockProperties = [
  {
    id: 1,
    title: "Casa Moderna com Piscina",
    price: 850000,
    bairro: "Jardim das Flores",
    cidade: "Teresina",
    bedrooms: 4,
    bathrooms: 3,
    area: 280,
    type: "Casa",
    status: "disponivel",
    featured: true,
    image: "/modern-house-with-pool.png",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    title: "Apartamento Luxuoso Centro",
    price: 450000,
    bairro: "Centro",
    cidade: "Timon",
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    type: "Apartamento",
    status: "disponivel",
    featured: true,
    image: "/luxury-apartment-interior.png",
    createdAt: "2024-01-10",
  },
  {
    id: 3,
    title: "Cobertura com Vista Panorâmica",
    price: 1200000,
    bairro: "Vila Madalena",
    cidade: "Teresina",
    bedrooms: 3,
    bathrooms: 3,
    area: 180,
    type: "Cobertura",
    status: "vendido",
    featured: false,
    image: "/penthouse-city-view.png",
    createdAt: "2024-01-05",
  },
]

function AdminPropertiesPage() {
  const { user, logout } = useAuth()
  const [properties, setProperties] = useState(mockProperties)
  
  // Estados para os filtros
  const [filters, setFilters] = useState({
    searchTerm: "",
    status: "all",
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

  const [showFilters, setShowFilters] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [propertyToDelete, setPropertyToDelete] = useState<number | null>(null)

  const handleFilterChange = (filterName: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value }))
  }

  const filteredProperties = useMemo(() => {
    const { searchTerm, status, type, cidade, bairro, minPrice, maxPrice, bedrooms, bathrooms, area, sortBy } = filters
    
    let filtered = properties.filter((property) => {
      const matchesSearch =
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.bairro.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.cidade.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = status === "all" || property.status === status
      const matchesType = type === "all" || property.type.toLowerCase() === type
      const matchesCidade = cidade === "all" || property.cidade === cidade
      const matchesBairro = !bairro || property.bairro.toLowerCase().includes(bairro.toLowerCase())
      const matchesMinPrice = !minPrice || property.price >= parseInt(minPrice)
      const matchesMaxPrice = !maxPrice || property.price <= parseInt(maxPrice)
      const matchesBedrooms = !bedrooms || property.bedrooms >= parseInt(bedrooms)
      const matchesBathrooms = !bathrooms || property.bathrooms >= parseInt(bathrooms)
      const matchesArea = !area || property.area >= parseInt(area)

      return matchesSearch && matchesStatus && matchesType && matchesCidade && matchesBairro && matchesMinPrice && matchesMaxPrice && matchesBedrooms && matchesBathrooms && matchesArea
    });

    // Lógica de Ordenação
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

    return filtered;

  }, [properties, filters])

  const featuredCount = properties.filter((property) => property.featured).length

  const handleStatusChange = (propertyId: number, newStatus: string) => {
    setProperties((prev) =>
      prev.map((property) => (property.id === propertyId ? { ...property, status: newStatus } : property)),
    )
  }

  const handleDelete = (propertyId: number) => {
    setProperties((prev) => prev.filter((property) => property.id !== propertyId))
    setDeleteDialogOpen(false)
    setPropertyToDelete(null)
  }

  const toggleFeatured = (propertyId: number) => {
    const property = properties.find((p) => p.id === propertyId)

    if (property && !property.featured && featuredCount >= 5) {
      alert("Você pode marcar no máximo 5 imóveis como destaque!")
      return
    }

    setProperties((prev) =>
      prev.map((property) => (property.id === propertyId ? { ...property, featured: !property.featured } : property)),
    )
  }
  
  const clearFilters = () => {
    setFilters({
        searchTerm: "", status: "all", type: "all", cidade: "all", bairro: "",
        minPrice: "", maxPrice: "", bedrooms: "", bathrooms: "", area: "", sortBy: "newest"
    })
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
                <span className="text-xl font-bold">GR Imóveis</span>
              </Link>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary">
                Admin
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="hover:text-primary transition-colors">
                Dashboard
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-secondary mb-2">Gerenciar Imóveis</h1>
            <p className="text-muted-foreground">
              {filteredProperties.length} de {properties.length} imóveis
              <span className="ml-4 text-primary font-medium">{featuredCount}/5 imóveis em destaque</span>
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/imoveis/novo">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Imóvel
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <div className="space-y-4 mb-6">
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
                    <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
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
                        <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos os Status</SelectItem>
                                <SelectItem value="disponivel">Disponível</SelectItem>
                                <SelectItem value="indisponivel">Indisponível</SelectItem>
                                <SelectItem value="vendido">Vendido</SelectItem>
                                <SelectItem value="alugado">Alugado</SelectItem>
                            </SelectContent>
                        </Select>
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
                        <Input type="number" placeholder="Preço Mín." value={filters.minPrice} onChange={(e) => handleFilterChange("minPrice", e.target.value)} />
                        <Input type="number" placeholder="Preço Máx." value={filters.maxPrice} onChange={(e) => handleFilterChange("maxPrice", e.target.value)} />
                        <Input type="number" placeholder="Quartos (mín.)" value={filters.bedrooms} onChange={(e) => handleFilterChange("bedrooms", e.target.value)} />
                        <Input type="number" placeholder="Banheiros (mín.)" value={filters.bathrooms} onChange={(e) => handleFilterChange("bathrooms", e.target.value)} />
                        <Input type="number" placeholder="Área (m² mín.)" value={filters.area} onChange={(e) => handleFilterChange("area", e.target.value)} />
                    </div>
                </CardContent>
            </Card>
            )}
        </div>

        {/* Properties Table */}
        <Card className="shadow-lg">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Imóvel</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Destaque</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProperties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <img
                          src={property.image || "/placeholder.svg?height=60&width=80"}
                          alt={property.title}
                          className="w-16 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium">{property.title}</p>
                          <p className="text-sm text-muted-foreground">{property.bairro}, {property.cidade} - {property.type}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(property.price)}
                    </TableCell>
                    <TableCell>
                      <Select value={property.status} onValueChange={(value) => handleStatusChange(property.id, value)}>
                        <SelectTrigger className="w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="disponivel">Disponível</SelectItem>
                          <SelectItem value="indisponivel">Indisponível</SelectItem>
                          <SelectItem value="vendido">Vendido</SelectItem>
                          <SelectItem value="alugado">Alugado</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleFeatured(property.id)}
                        className={property.featured ? "text-yellow-500 hover:text-yellow-600" : "text-muted-foreground hover:text-yellow-500"}
                        disabled={!property.featured && featuredCount >= 5}
                        title={
                          !property.featured && featuredCount >= 5
                            ? "Limite de destaques atingido"
                            : property.featured
                              ? "Remover dos destaques"
                              : "Marcar como destaque"
                        }
                      >
                        <Star className={`h-5 w-5 ${property.featured ? "fill-current" : ""}`} />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/imoveis/${property.id}`} target="_blank">
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/imoveis/${property.id}/editar`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setPropertyToDelete(property.id)
                            setDeleteDialogOpen(true)
                          }}
                          className="text-red-600 hover:bg-red-100 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredProperties.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Nenhum imóvel encontrado com os filtros aplicados.</p>
                <Button variant="link" onClick={clearFilters}>Limpar filtros</Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Exclusão</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir este imóvel? Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={() => propertyToDelete && handleDelete(propertyToDelete)}>
                Excluir
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}

export default function AdminPropertiesPageWrapper() {
  return (
    <ProtectedRoute>
      <AdminPropertiesPage />
    </ProtectedRoute>
  )
}