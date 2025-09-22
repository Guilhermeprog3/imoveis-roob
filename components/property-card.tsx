"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Bed, Bath, Square, Phone, Share2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { NotificationToast } from "./notification-toast"

interface Property {
  id: string
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
      <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 group gradient-card border-0 h-full flex flex-col">
        <div className="relative overflow-hidden">
          <Link href={`/imoveis/${property.id}`} className="block">
            <img
              src={property.image || "/placeholder.svg?height=250&width=400"}
              alt={property.title}
              className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
            />
          </Link>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

          <div className="absolute top-4 left-4 flex gap-2">
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
             {property.featured && (
                <Badge className="bg-secondary text-secondary-foreground shadow-lg">Destaque</Badge>
            )}
          </div>
          
          <button
            onClick={handleShare}
            className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl opacity-0 group-hover:opacity-100"
            title="Compartilhar"
          >
            <Share2 className="h-4 w-4 text-muted-foreground hover:text-primary" />
          </button>

           <div className="absolute bottom-4 left-4">
              <h3 className="text-xl font-bold text-white mb-1 drop-shadow-lg">{property.title}</h3>
              <div className="flex items-center text-white/90 text-sm">
                <MapPin className="h-4 w-4 mr-2" />
                <span className="line-clamp-1">{property.location}</span>
              </div>
            </div>
        </div>

        <CardContent className="p-6 flex-grow">
          <div className="flex items-center justify-between mb-4 text-muted-foreground border-b pb-4">
            <div className="flex items-center gap-2">
              <Bed className="h-5 w-5 text-primary" />
              <span className="font-medium">{property.bedrooms}</span>
              <span className="hidden sm:inline">Quartos</span>
            </div>
            <div className="flex items-center gap-2">
              <Bath className="h-5 w-5 text-primary" />
              <span className="font-medium">{property.bathrooms}</span>
               <span className="hidden sm:inline">Banheiros</span>
            </div>
            <div className="flex items-center gap-2">
              <Square className="h-5 w-5 text-primary" />
              <span className="font-medium">{property.area}m²</span>
            </div>
          </div>

          <div className="text-3xl font-bold text-primary mb-4">{property.price}</div>
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