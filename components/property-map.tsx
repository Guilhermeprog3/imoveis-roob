"use client"

import { useState } from "react"
import { MapPin, Navigation, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PropertyMapProps {
  address: string
  lat?: number
  lng?: number
}

export function PropertyMap({ address, lat = -23.5505, lng = -46.6333 }: PropertyMapProps) {
  const [mapLoaded, setMapLoaded] = useState(false)

  const openInGoogleMaps = () => {
    const encodedAddress = encodeURIComponent(address)
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`
    window.open(googleMapsUrl, "_blank")
  }

  const openDirections = () => {
    const encodedAddress = encodeURIComponent(address)
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`
    window.open(directionsUrl, "_blank")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-secondary">Localização</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={openDirections} className="rounded-xl bg-transparent">
            <Navigation className="h-4 w-4 mr-2" />
            Como Chegar
          </Button>
          <Button variant="outline" size="sm" onClick={openInGoogleMaps} className="rounded-xl bg-transparent">
            <ExternalLink className="h-4 w-4 mr-2" />
            Ver no Maps
          </Button>
        </div>
      </div>

      <div
        className="aspect-video bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl flex items-center justify-center relative overflow-hidden border-2 border-border hover:border-primary/30 transition-colors duration-300 cursor-pointer group"
        onClick={openInGoogleMaps}
      >
        <div className="text-center z-10">
          <div className="p-4 bg-white/90 rounded-full mb-4 group-hover:bg-white transition-colors duration-300 shadow-lg">
            <MapPin className="h-12 w-12 text-primary mx-auto" />
          </div>
          <p className="text-lg font-semibold text-secondary mb-2">Mapa Interativo</p>
          <p className="text-sm text-muted-foreground max-w-xs">{address}</p>
          <p className="text-xs text-muted-foreground mt-2 opacity-75">Clique para abrir no Google Maps</p>
        </div>

        {/* Animated background elements */}
        <div className="absolute top-10 left-10 w-16 h-16 bg-primary/10 rounded-full animate-float"></div>
        <div
          className="absolute bottom-10 right-10 w-12 h-12 bg-accent/10 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/4 w-8 h-8 bg-secondary/10 rounded-full animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="flex items-start gap-4 p-6 gradient-card rounded-2xl border-0 shadow-lg">
        <div className="p-3 bg-primary/10 rounded-lg flex-shrink-0">
          <MapPin className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-secondary mb-2">Endereço Completo</h4>
          <p className="text-card-foreground mb-3 leading-relaxed">{address}</p>
          <p className="text-sm text-muted-foreground">
            📍 Localização aproximada por questões de segurança e privacidade
          </p>
        </div>
      </div>
    </div>
  )
}
