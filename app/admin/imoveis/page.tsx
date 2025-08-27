"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Home, LogOut, Plus, Search, Edit, Trash2, Eye, Star, Filter } from "lucide-react"
import Link from "next/link"

// Mock data - seria substituído por dados reais do banco
const mockProperties = [
  {
    id: 1,
    title: "Casa Moderna com Piscina",
    price: "R$ 850.000",
    location: "Jardim das Flores, São Paulo",
    type: "Casa",
    status: "disponivel",
    featured: true,
    image: "/modern-house-with-pool.png",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    title: "Apartamento Luxuoso Centro",
    price: "R$ 3.500/mês",
    location: "Centro, São Paulo",
    type: "Apartamento",
    status: "disponivel",
    featured: true,
    image: "/luxury-apartment-interior.png",
    createdAt: "2024-01-10",
  },
  {
    id: 3,
    title: "Cobertura com Vista Panorâmica",
    price: "R$ 1.200.000",
    location: "Vila Madalena, São Paulo",
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
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [propertyToDelete, setPropertyToDelete] = useState<number | null>(null)

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || property.status === statusFilter
    const matchesType = typeFilter === "all" || property.type.toLowerCase() === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const featuredCount = properties.filter((property) => property.featured).length

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "disponivel":
        return <Badge className="bg-green-600">Disponível</Badge>
      case "vendido":
        return <Badge className="bg-red-600">Vendido</Badge>
      case "alugado":
        return <Badge className="bg-blue-600">Alugado</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

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
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar imóveis..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="disponivel">Disponível</SelectItem>
                  <SelectItem value="vendido">Vendido</SelectItem>
                  <SelectItem value="alugado">Alugado</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Tipos</SelectItem>
                  <SelectItem value="casa">Casa</SelectItem>
                  <SelectItem value="apartamento">Apartamento</SelectItem>
                  <SelectItem value="cobertura">Cobertura</SelectItem>
                  <SelectItem value="terreno">Terreno</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all")
                  setTypeFilter("all")
                }}
              >
                Limpar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Properties Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Imóvel</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Destaque</TableHead>
                  <TableHead>Ações</TableHead>
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
                          <p className="text-sm text-muted-foreground">{property.location}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{property.type}</TableCell>
                    <TableCell className="font-medium">{property.price}</TableCell>
                    <TableCell>
                      <Select value={property.status} onValueChange={(value) => handleStatusChange(property.id, value)}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="disponivel">Disponível</SelectItem>
                          <SelectItem value="vendido">Vendido</SelectItem>
                          <SelectItem value="alugado">Alugado</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFeatured(property.id)}
                        className={property.featured ? "text-yellow-600" : "text-muted-foreground"}
                        disabled={!property.featured && featuredCount >= 5}
                        title={
                          !property.featured && featuredCount >= 5
                            ? "Limite máximo de 5 imóveis em destaque atingido"
                            : property.featured
                              ? "Remover dos destaques"
                              : "Marcar como destaque"
                        }
                      >
                        <Star className={`h-4 w-4 ${property.featured ? "fill-current" : ""}`} />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/imoveis/${property.id}`} target="_blank">
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/imoveis/${property.id}/editar`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setPropertyToDelete(property.id)
                            setDeleteDialogOpen(true)
                          }}
                          className="text-red-600 hover:text-red-700"
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
              <div className="text-center py-8">
                <p className="text-muted-foreground">Nenhum imóvel encontrado.</p>
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
