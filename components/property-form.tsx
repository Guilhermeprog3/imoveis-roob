"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Upload, Building, MapPin, DollarSign, Bed } from "lucide-react"
import { Separator } from "@/components/ui/separator"

const formatCurrency = (value: string) => {
  if (!value) return ""
  let numberValue = parseInt(value.replace(/[^0-9]/g, ''), 10)
  if (isNaN(numberValue)) return ""
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(numberValue / 100)
}

const formatArea = (value: string) => {
  if (!value) return ""
  const numberValue = value.replace(/[^0-9]/g, '')
  return numberValue ? `${numberValue} m²` : ""
}

export interface PropertyFormData {
  title: string
  description: string
  price: string
  bairro: string
  cidade: string;
  outraCidade?: string;
  bedrooms: number
  suites: number
  closets: number
  bathrooms: number
  area: string
  garageSpaces: number
  type: string
  status: string
  featured: boolean
  images: string[]
  features: string[]
}

interface PropertyFormProps {
  initialData?: Partial<PropertyFormData>
  onSubmit: (data: PropertyFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

const propertyTypes = [
  { value: "casa", label: "Casa" },
  { value: "apartamento", label: "Apartamento" },
  { value: "cobertura", label: "Cobertura" },
  { value: "terreno", label: "Terreno" },
  { value: "comercial", label: "Comercial" },
]

const statusOptions = [
  { value: "disponivel", label: "Disponível" },
  { value: "indisponivel", label: "Indisponível" },
  { value: "vendido", label: "Vendido" },
  { value: "alugado", label: "Alugado" },
]

const cityOptions = [
    { value: "Teresina", label: "Teresina" },
    { value: "Timon", label: "Timon" },
    { value: "Caxias", label: "Caxias" },
    { value: "Campo Maior", label: "Campo Maior" },
    { value: "Altos", label: "Altos" },
    { value: "Parnaíba", label: "Parnaíba" },
    { value: "São Luís", label: "São Luís" },
    { value: "Outra", label: "Outra" },
]

const availableFeatures = [
  "Internet Fibra Ótica",
  "Piscina",
  "Jardim",
  "Churrasqueira",
  "Área de Lazer",
  "Portaria 24h",
  "Academia",
  "Playground",
  "Salão de Festas",
  "Elevador",
  "Ar Condicionado",
  "Aquecimento Solar",
]

export function PropertyForm({ initialData, onSubmit, onCancel, isLoading }: PropertyFormProps) {
  const [formData, setFormData] = useState<PropertyFormData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    price: initialData?.price ? formatCurrency(initialData.price) : "",
    bairro: initialData?.bairro || "",
    cidade: initialData?.cidade || "",
    outraCidade: initialData?.outraCidade || "",
    bedrooms: initialData?.bedrooms || 0,
    suites: initialData?.suites || 0,
    closets: initialData?.closets || 0,
    bathrooms: initialData?.bathrooms || 0,
    area: initialData?.area ? formatArea(String(initialData.area)) : "",
    garageSpaces: initialData?.garageSpaces || 0,
    type: initialData?.type || "",
    status: initialData?.status || "disponivel",
    featured: initialData?.featured || false,
    images: initialData?.images || [],
    features: initialData?.features || [],
  })

  const [newImageUrl, setNewImageUrl] = useState("")
  const [customFeature, setCustomFeature] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (field: keyof PropertyFormData, value: any) => {
    let formattedValue = value

    if (field === 'price') {
      formattedValue = formatCurrency(value)
    } else if (field === 'area') {
        formattedValue = formatArea(value)
    }

    setFormData((prev) => ({ ...prev, [field]: formattedValue }))
  }

  const handleNumericInputChange = (field: keyof PropertyFormData, value: string) => {
    const numericValue = parseInt(value, 10);
    if (!isNaN(numericValue) && numericValue >= 0) {
      setFormData((prev) => ({...prev, [field]: numericValue}));
    } else if (value === "") {
      setFormData((prev) => ({...prev, [field]: 0}));
    }
  };


  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result as string
          setFormData((prev) => ({
            ...prev,
            images: [...prev.images, result],
          }))
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const addImage = () => {
    if (newImageUrl.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, newImageUrl.trim()],
      }))
      setNewImageUrl("")
    }
  }

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const toggleFeature = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }))
  }

  const addCustomFeature = () => {
    if (customFeature.trim() && !formData.features.includes(customFeature.trim())) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, customFeature.trim()],
      }))
      setCustomFeature("")
    }
  }

  const removeFeature = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((f) => f !== feature),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-6 w-6 text-primary" />
            Informações Principais
          </CardTitle>
          <CardDescription>Defina os detalhes essenciais do seu anúncio.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Título do Anúncio <span className="text-red-500">*</span></Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Ex: Casa Moderna com Piscina"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição Completa <span className="text-red-500">*</span></Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Descreva detalhadamente o imóvel..."
              rows={5}
              required
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-6 w-6 text-primary" />
              Valores e Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="type">Tipo de Imóvel <span className="text-red-500">*</span></Label>
                    <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>{propertyTypes.map(type => <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="status">Status <span className="text-red-500">*</span></Label>
                    <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>{statusOptions.map(status => <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Preço</Label>
              <Input id="price" value={formData.price} onChange={(e) => handleInputChange("price", e.target.value)} placeholder="R$ 0,00" />
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox id="featured" checked={formData.featured} onCheckedChange={(checked) => handleInputChange("featured", checked)} />
              <Label htmlFor="featured">Marcar como Imóvel Destaque</Label>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-6 w-6 text-primary" />
              Localização
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="space-y-2">
                <Label htmlFor="cidade">Cidade <span className="text-red-500">*</span></Label>
                <Select value={formData.cidade} onValueChange={(value) => handleInputChange("cidade", value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecione a cidade" />
                    </SelectTrigger>
                    <SelectContent>
                        {cityOptions.map((city) => (
                            <SelectItem key={city.value} value={city.value}>
                                {city.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </div>
              {formData.cidade === 'Outra' && (
                <div className="space-y-2">
                  <Label htmlFor="outraCidade">Qual cidade?</Label>
                  <Input id="outraCidade" value={formData.outraCidade} onChange={(e) => handleInputChange("outraCidade", e.target.value)} placeholder="Digite o nome da cidade" />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="bairro">Bairro</Label>
                <Input id="bairro" value={formData.bairro} onChange={(e) => handleInputChange("bairro", e.target.value)} placeholder="Ex: Jardim das Flores" />
              </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Bed className="h-6 w-6 text-primary" />
                Especificações
            </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
                <Label htmlFor="bedrooms">Quartos</Label>
                <Input id="bedrooms" type="number" min="0" value={formData.bedrooms} onChange={(e) => handleNumericInputChange("bedrooms", e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="suites">Suítes</Label>
                <Input id="suites" type="number" min="0" value={formData.suites} onChange={(e) => handleNumericInputChange("suites", e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="closets">Closets</Label>
                <Input id="closets" type="number" min="0" value={formData.closets} onChange={(e) => handleNumericInputChange("closets", e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="bathrooms">Banheiros</Label>
                <Input id="bathrooms" type="number" min="0" value={formData.bathrooms} onChange={(e) => handleNumericInputChange("bathrooms", e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="area">Área</Label>
                <Input id="area" value={formData.area} onChange={(e) => handleInputChange("area", e.target.value)} placeholder="0 m²" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="garageSpaces">Vagas de Garagem</Label>
                <Input id="garageSpaces" type="number" min="0" value={formData.garageSpaces} onChange={(e) => handleNumericInputChange("garageSpaces", e.target.value)} />
            </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Fotos do Imóvel</CardTitle>
          <CardDescription>Envie as melhores fotos para atrair mais clientes.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="flex-1">
              <Upload className="h-4 w-4 mr-2" />
              Upload de Imagens
            </Button>
            <div className="flex flex-1 gap-2 items-center">
                <Input placeholder="Ou adicione por URL" value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} />
                <Button type="button" onClick={addImage} variant="outline" className="whitespace-nowrap"><Plus className="h-4 w-4 mr-2" />Adicionar</Button>
            </div>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileUpload} className="hidden" />

          {formData.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 pt-4 border-t">
              {formData.images.map((image, index) => (
                <div key={index} className="relative group aspect-square">
                  <img src={image || "/placeholder.svg"} alt={`Foto ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                  <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeImage(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Características Adicionais</CardTitle>
          <CardDescription>Selecione as comodidades que o imóvel oferece.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {availableFeatures.map((feature) => (
                    <div key={feature} className="flex items-center space-x-2">
                        <Checkbox id={feature} checked={formData.features.includes(feature)} onCheckedChange={() => toggleFeature(feature)} />
                        <Label htmlFor={feature} className="text-sm font-normal cursor-pointer">{feature}</Label>
                    </div>
                ))}
            </div>
            <Separator className="my-6" />
            <div className="space-y-2">
                <Label className="text-base font-medium">Adicionar Característica Personalizada</Label>
                <div className="flex gap-2">
                    <Input placeholder="Ex: Piscina aquecida, Sauna, etc." value={customFeature} onChange={(e) => setCustomFeature(e.target.value)} onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCustomFeature())} />
                    <Button type="button" onClick={addCustomFeature} variant="outline"><Plus className="h-4 w-4 mr-2" />Adicionar</Button>
                </div>
            </div>
            {formData.features.length > 0 && (
                <div className="mt-6">
                <p className="text-base font-medium mb-3">Características selecionadas:</p>
                <div className="flex flex-wrap gap-2">
                    {formData.features.map((feature) => (
                    <Badge key={feature} variant="secondary" className="text-sm">
                        {feature}
                        <button type="button" onClick={() => removeFeature(feature)} className="ml-2 hover:text-destructive">
                        <X className="h-3 w-3" />
                        </button>
                    </Badge>
                    ))}
                </div>
                </div>
            )}
        </CardContent>
      </Card>
      <div className="flex gap-4 justify-end pt-4">
        <Button type="button" variant="outline" size="lg" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="submit" size="lg" disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar Imóvel"}
        </Button>
      </div>
    </form>
  )
}