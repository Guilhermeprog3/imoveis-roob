"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Bed, Bath, Square, Phone, Share2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { NotificationToast } from "./notification-toast"

interface Property {
  id: number
  title: string
  price: string
  location: string
  bedrooms: number
  bathrooms: number
  area: number
  type: string
  status: "À Venda" | "Para Alugar" | "Vendido" | "Alugado"
  image: string
  featured?: boolean
}

interface PropertyCardProps {
  property: Property
}

export function PropertyCard({ property }: PropertyCardProps) {
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null)

  const handleWhatsAppContact = () => {
    const message = `Olá! Tenho interesse no imóvel: ${property.title} (Ref: ${property.id})`
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const handleShare = async () => {
    const shareData = {
      title: property.title,
      text: `Confira este imóvel: ${property.title} - ${property.price}`,
      url: `${window.location.origin}/imoveis/${property.id}`,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
        setNotification({ message: "Imóvel compartilhado com sucesso", type: "success" })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareData.url)
        setNotification({ message: "Link copiado para área de transferência", type: "success" })
      } catch (error) {
        setNotification({ message: "Erro ao copiar link", type: "error" })
      }
    }
  }

  return (
    <>
      <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 group gradient-card border-0">
        <div className="relative overflow-hidden">
          <img
            src={property.image || "/placeholder.svg?height=250&width=400"}
            alt={property.title}
            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          <div className="absolute top-4 left-4">
            <Badge
              variant={property.status === "À Venda" ? "default" : "secondary"}
              className={
                property.status === "À Venda"
                  ? "bg-primary shadow-lg"
                  : property.status === "Para Alugar"
                    ? "bg-accent shadow-lg"
                    : "bg-muted-foreground shadow-lg"
              }
            >
              {property.status}
            </Badge>
          </div>

          {property.featured && (
            <div className="absolute top-4 right-16">
              <Badge className="bg-accent text-white shadow-lg">Destaque</Badge>
            </div>
          )}

          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={handleShare}
              className="p-2 bg-white/90 rounded-full hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl"
              title="Compartilhar"
            >
              <Share2 className="h-4 w-4 text-muted-foreground hover:text-primary" />
            </button>
          </div>
        </div>

        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-3 text-secondary group-hover:text-primary transition-colors duration-300 line-clamp-2">
            {property.title}
          </h3>
          <div className="flex items-center text-muted-foreground mb-4">
            <MapPin className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
            <span className="text-sm line-clamp-1">{property.location}</span>
          </div>

          <div className="flex items-center justify-between mb-4 text-muted-foreground">
            <div className="flex items-center bg-muted/50 px-3 py-2 rounded-lg">
              <Bed className="h-4 w-4 mr-2" />
              <span className="font-medium">{property.bedrooms}</span>
            </div>
            <div className="flex items-center bg-muted/50 px-3 py-2 rounded-lg">
              <Bath className="h-4 w-4 mr-2" />
              <span className="font-medium">{property.bathrooms}</span>
            </div>
            <div className="flex items-center bg-muted/50 px-3 py-2 rounded-lg">
              <Square className="h-4 w-4 mr-2" />
              <span className="font-medium">{property.area}m²</span>
            </div>
          </div>

          <div className="text-2xl font-bold text-primary mb-4">{property.price}</div>
        </CardContent>

        <CardFooter className="p-6 pt-0 flex gap-3">
          <Button asChild className="flex-1 h-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <Link href={`/imoveis/${property.id}`}>Ver Detalhes</Link>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleWhatsAppContact}
            title="Contato via WhatsApp"
            className="h-12 w-12 rounded-xl border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 bg-transparent"
          >
            <Phone className="h-5 w-5" />
          </Button>
        </CardFooter>
      </Card>

      {notification && (
        <NotificationToast
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </>
  )
}
