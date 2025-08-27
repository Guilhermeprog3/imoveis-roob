"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ImageGallery } from "@/components/image-gallery"
import { PropertyMap } from "@/components/property-map"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ArrowLeft,
  Mail,
  Share2,
  Bed,
  Bath,
  Square,
  Car,
  Wifi,
  Dumbbell,
  Trees,
  Shield,
  Waves,
  MapPin,
  Calendar,
  Eye,
  MessageCircle,
} from "lucide-react"
import Link from "next/link"

const brokers = {
  genilson: {
    name: "Genilson Silva Rios",
    creci: "CRECI 15.847-PI",
    phone: "(86) 99999-8888",
    email: "genilson@imovelpro.com",
    avatar: "/professional-male-realtor-portrait.png",
    specialties: ["Residencial", "Comercial"],
    experience: "8 anos de experiência",
  },
  gennyce: {
    name: "Gennyce Silva Rios",
    creci: "CRECI 18.234-MA",
    phone: "(99) 99999-7777",
    email: "gennyce@imovelpro.com",
    avatar: "/professional-female-realtor-portrait.png",
    specialties: ["Apartamentos", "Investimentos"],
    experience: "6 anos de experiência",
  },
}

// Mock data - seria substituído por dados reais do banco
const propertyData = {
  1: {
    id: 1,
    title: "Casa Moderna com Piscina",
    price: "R$ 850.000",
    location: "Jardim das Flores, Teresina - PI",
    address: "Rua das Flores, 123 - Jardim das Flores, Teresina - PI",
    bedrooms: 4,
    bathrooms: 3,
    area: 280,
    garageSpaces: 2,
    type: "Casa",
    status: "À Venda",
    views: 1247,
    publishedDate: "2024-01-15",
    description: `Esta magnífica casa moderna oferece o equilíbrio perfeito entre conforto e elegância. 
    Localizada no prestigioso bairro Jardim das Flores em Teresina, a propriedade conta com acabamentos de primeira qualidade 
    e um projeto arquitetônico contemporâneo que privilegia a integração entre os ambientes internos e externos.
    
    A casa possui amplos espaços sociais, cozinha gourmet totalmente equipada, suíte master com closet e hidromassagem, 
    além de uma área de lazer completa com piscina, churrasqueira e jardim paisagístico. 
    
    Ideal para famílias que buscam qualidade de vida em um ambiente sofisticado e acolhedor no coração do Piauí.`,
    features: [
      { icon: Wifi, label: "Internet Fibra Ótica" },
      { icon: Car, label: "2 Vagas de Garagem" },
      { icon: Waves, label: "Piscina" },
      { icon: Trees, label: "Jardim Paisagístico" },
      { icon: Shield, label: "Portaria 24h" },
      { icon: Dumbbell, label: "Área de Lazer" },
    ],
    images: [
      "/modern-house-with-pool.png",
      "/luxury-apartment-interior.png",
      "/penthouse-city-view.png",
      "/spacious-family-house.png",
    ],
    specifications: {
      "Área Total": "280 m²",
      "Área Construída": "220 m²",
      Quartos: "4",
      Suítes: "2",
      Banheiros: "3",
      Vagas: "2",
      "Ano de Construção": "2020",
      IPTU: "R$ 2.400/ano",
      Condomínio: "R$ 450/mês",
    },
  },
  2: {
    id: 2,
    title: "Apartamento Luxuoso Centro",
    price: "R$ 450.000",
    location: "Centro, Timon - MA",
    address: "Av. Getúlio Vargas, 456 - Centro, Timon - MA",
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    garageSpaces: 1,
    type: "Apartamento",
    status: "À Venda",
    views: 892,
    publishedDate: "2024-01-20",
    description: `Apartamento luxuoso no coração de Timon, com vista panorâmica da cidade. 
    Localizado em um dos edifícios mais modernos da região, oferece toda a comodidade urbana 
    com fácil acesso a comércios, restaurantes e serviços.
    
    O imóvel conta com acabamentos premium, cozinha americana integrada, varanda gourmet 
    e uma localização privilegiada no centro da cidade.`,
    features: [
      { icon: Wifi, label: "Internet Fibra Ótica" },
      { icon: Car, label: "1 Vaga de Garagem" },
      { icon: Shield, label: "Portaria 24h" },
      { icon: Dumbbell, label: "Academia" },
    ],
    images: ["/luxury-apartment-interior.png", "/modern-compact-apartment.png", "/penthouse-city-view.png"],
    specifications: {
      "Área Total": "120 m²",
      "Área Construída": "95 m²",
      Quartos: "3",
      Suítes: "1",
      Banheiros: "2",
      Vagas: "1",
      "Ano de Construção": "2022",
      IPTU: "R$ 1.200/ano",
      Condomínio: "R$ 280/mês",
    },
  },
}

export default function PropertyDetailsPage() {
  const params = useParams()
  const propertyId = params.id as string
  const property = propertyData[propertyId as keyof typeof propertyData]

  const [selectedBroker, setSelectedBroker] = useState<"genilson" | "gennyce">("genilson")

  if (!property) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-secondary mb-4">Imóvel não encontrado</h1>
            <Button asChild>
              <Link href="/imoveis">Voltar para Listagem</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const handleWhatsAppContact = () => {
    const broker = brokers[selectedBroker]
    const message = `Olá ${broker.name}! Tenho interesse no imóvel: ${property.title} (Ref: ${property.id}). Gostaria de mais informações.`
    const whatsappUrl = `https://wa.me/55${broker.phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const handleEmailContact = () => {
    const broker = brokers[selectedBroker]
    const subject = `Interesse no imóvel: ${property.title} (Ref: ${property.id})`
    const body = `Olá ${broker.name},\n\nTenho interesse no imóvel "${property.title}" e gostaria de mais informações.\n\nAguardo retorno.\n\nObrigado(a)!`
    window.location.href = `mailto:${broker.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: `Confira este imóvel: ${property.title}`,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert("Link copiado para a área de transferência!")
    }
  }

  const currentBroker = brokers[selectedBroker]

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link href="/imoveis">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Listagem
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <ImageGallery images={property.images} title={property.title} />

            {/* Property Info */}
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      variant={property.status === "À Venda" ? "default" : "secondary"}
                      className={property.status === "À Venda" ? "bg-primary" : "bg-accent"}
                    >
                      {property.status}
                    </Badge>
                    <Badge variant="outline">{property.type}</Badge>
                  </div>
                  <h1 className="text-3xl font-bold text-secondary mb-2 text-balance">{property.title}</h1>
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4" />
                    <p>{property.location}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{property.views.toLocaleString()} visualizações</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Publicado em {new Date(property.publishedDate).toLocaleDateString("pt-BR")}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="text-4xl font-bold text-primary">{property.price}</div>

              {/* Quick Stats */}
              <div className="flex items-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Bed className="h-5 w-5" />
                  <span>{property.bedrooms} quartos</span>
                </div>
                <div className="flex items-center gap-1">
                  <Bath className="h-5 w-5" />
                  <span>{property.bathrooms} banheiros</span>
                </div>
                <div className="flex items-center gap-1">
                  <Square className="h-5 w-5" />
                  <span>{property.area}m²</span>
                </div>
                <div className="flex items-center gap-1">
                  <Car className="h-5 w-5" />
                  <span>{property.garageSpaces} vagas</span>
                </div>
              </div>

              <Separator />

              {/* Description */}
              <div>
                <h2 className="text-2xl font-semibold text-secondary mb-4">Descrição</h2>
                <div className="prose prose-gray max-w-none">
                  {property.description.split("\n").map((paragraph, index) => (
                    <p key={index} className="mb-4 text-muted-foreground leading-relaxed">
                      {paragraph.trim()}
                    </p>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <h2 className="text-2xl font-semibold text-secondary mb-4">Características</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-card rounded-lg border">
                      <feature.icon className="h-5 w-5 text-primary" />
                      <span className="text-sm text-card-foreground">{feature.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Map */}
              <PropertyMap address={property.address} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Escolha seu Corretor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <Button
                    variant={selectedBroker === "genilson" ? "default" : "outline"}
                    onClick={() => setSelectedBroker("genilson")}
                    className="text-sm"
                  >
                    Genilson
                  </Button>
                  <Button
                    variant={selectedBroker === "gennyce" ? "default" : "outline"}
                    onClick={() => setSelectedBroker("gennyce")}
                    className="text-sm"
                  >
                    Gennyce
                  </Button>
                </div>

                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={currentBroker.avatar || "/placeholder.svg"} alt={currentBroker.name} />
                    <AvatarFallback>
                      {currentBroker.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{currentBroker.name}</h3>
                    <p className="text-sm text-primary font-medium">{currentBroker.creci}</p>
                    <p className="text-xs text-muted-foreground">{currentBroker.experience}</p>
                    <div className="flex gap-1 mt-1">
                      {currentBroker.specialties.map((specialty, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <Button onClick={handleWhatsAppContact} className="w-full" size="lg">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>
                <Button onClick={handleEmailContact} variant="outline" className="w-full bg-transparent" size="lg">
                  <Mail className="h-4 w-4 mr-2" />
                  E-mail
                </Button>
                <div className="text-center text-sm text-muted-foreground">
                  <p>{currentBroker.phone}</p>
                  <p>{currentBroker.email}</p>
                </div>
              </CardContent>
            </Card>

            {/* Specifications */}
            <Card>
              <CardHeader>
                <CardTitle>Especificações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(property.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-muted-foreground">{key}:</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reference */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Referência do Imóvel</p>
                  <p className="text-lg font-bold text-primary">#{property.id.toString().padStart(6, "0")}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
