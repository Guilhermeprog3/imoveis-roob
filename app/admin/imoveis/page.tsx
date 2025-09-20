"use client"

import { useState, useMemo, useEffect } from "react"
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
import { Plus, Search, Edit, Trash2, Eye, Star, Filter, X } from "lucide-react"
import Link from "next/link"
import { db } from "@/firebase/config";
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore";
import { AdminNavbar } from "@/components/admin-navbar";

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


function AdminPropertiesPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
  
  const [displayFilters, setDisplayFilters] = useState({
    minPrice: "",
    maxPrice: "",
    area: "",
  });


  const [showFilters, setShowFilters] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null)

  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      const q = query(collection(db, "imoveis"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const propertiesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProperties(propertiesData);
      setIsLoading(false);
    };

    fetchProperties();
  }, []);

  const handleFilterChange = (filterName: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value }))
  }
  
  const handleFormattedInputChange = (key: 'minPrice' | 'maxPrice' | 'area', value: string) => {
    let formattedDisplay = '';
    let numericValue = value.replace(/[^0-9]/g, '');

    if (key === 'minPrice' || key === 'maxPrice') {
        formattedDisplay = formatCurrencyForFilter(value);
    } else if (key === 'area') {
        formattedDisplay = formatAreaForFilter(value);
    }
    
    setDisplayFilters(prev => ({ ...prev, [key]: formattedDisplay }));
    handleFilterChange(key, numericValue);
  };


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

  const handleStatusChange = async (propertyId: string, newStatus: string) => {
    const propertyRef = doc(db, "imoveis", propertyId);
    try {
      await updateDoc(propertyRef, { status: newStatus });
      setProperties((prev) =>
        prev.map((property) => (property.id === propertyId ? { ...property, status: newStatus } : property)),
      );
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  const handleDelete = async (propertyId: string) => {
    try {
      await deleteDoc(doc(db, "imoveis", propertyId));
      setProperties((prev) => prev.filter((property) => property.id !== propertyId));
      setDeleteDialogOpen(false);
      setPropertyToDelete(null);
    } catch (error) {
      console.error("Erro ao deletar imóvel:", error);
    }
  };


  const toggleFeatured = async (propertyId: string) => {
    const property = properties.find((p) => p.id === propertyId);
    if (!property) return;

    const newFeaturedState = !property.featured;

    if (newFeaturedState && featuredCount >= 5) {
        alert("Você pode marcar no máximo 5 imóveis como destaque!");
        return;
    }

    const propertyRef = doc(db, "imoveis", propertyId);
    try {
        await updateDoc(propertyRef, { featured: newFeaturedState });
        setProperties((prev) =>
            prev.map((p) =>
                p.id === propertyId ? { ...p, featured: newFeaturedState } : p
            )
        );
    } catch (error) {
        console.error("Erro ao atualizar destaque:", error);
    }
  };
  
  const clearFilters = () => {
    setFilters({
        searchTerm: "", status: "all", type: "all", cidade: "all", bairro: "",
        minPrice: "", maxPrice: "", bedrooms: "", bathrooms: "", area: "", sortBy: "newest"
    })
    setDisplayFilters({minPrice: "", maxPrice: "", area: ""});
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar />

      <main className="container mx-auto px-4 py-8">
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

        <Card className="shadow-lg">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="text-center p-12">Carregando imóveis...</div>
            ) : (
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
                            src={property.images[0] || "/placeholder.svg?height=60&width=80"}
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
            )}

            {!isLoading && filteredProperties.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Nenhum imóvel encontrado com os filtros aplicados.</p>
                <Button variant="link" onClick={clearFilters}>Limpar filtros</Button>
              </div>
            )}
          </CardContent>
        </Card>

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