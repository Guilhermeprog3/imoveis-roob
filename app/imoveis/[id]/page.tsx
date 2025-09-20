// app/imoveis/[id]/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useParams, notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ImageGallery } from "@/components/image-gallery"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ArrowLeft, Mail, Share2, Bed, Bath, Square, Car, Wifi, Dumbbell,
  Trees, Shield, Waves, MapPin, Calendar, MessageCircle, Loader2,
  Info // <<-- Ícone adicionado
} from "lucide-react"
import Link from "next/link"
import { db } from "@/firebase/config"
import { doc, getDoc, collection, getDocs, query, where, limit } from "firebase/firestore"
import { PropertyCard } from "@/components/property-card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

// Para os ícones de redes sociais (exemplo de importação):
// import { SiInstagram, SiFacebook } from "simple-icons-react";
// Como não posso adicionar a dependência, usarei placeholders.
const IconInstagram = ({ className }: { className?: string }) => (
  <svg className={className}>{/* SVG do Instagram aqui */}</svg>
);
const IconFacebook = ({ className }: { className?: string }) => (
  <svg className={className}>{/* SVG do Facebook aqui */}</svg>
);


// Interfaces para os dados
interface Property {
  id: string;
  title: string;
  price: string;
  bairro: string;
  cidade: string;
  address?: string;
  bedrooms: number;
  suites: number;
  closets: number;
  bathrooms: number;
  area: number;
  garageSpaces: number;
  type: string;
  status: string;
  createdAt: string;
  description: string;
  features: string[];
  images: string[];
}

// <<-- INTERFACE ATUALIZADA -->>
interface Broker {
  id: string;
  nome: string;
  photo: string;
  creci: string;
  specialties: string[];
  experience: string;
  phone: string;
  email: string;
  whatsapp: string;
  instagram?: string; // <-- Novo campo opcional
  facebook?: string;  // <-- Novo campo opcional
}

const featureIconMap: { [key: string]: React.ElementType } = {
  "Internet Fibra Ótica": Wifi,
  "Piscina": Waves,
  "Jardim": Trees,
  "Portaria 24h": Shield,
  "Área de Lazer": Dumbbell,
  "Academia": Dumbbell,
};

export default function PropertyDetailsPage() {
  const params = useParams()
  const propertyId = params.id as string
  
  const [property, setProperty] = useState<Property | null>(null)
  const [brokers, setBrokers] = useState<Broker[]>([])
  const [selectedBroker, setSelectedBroker] = useState<Broker | null>(null)
  const [relatedProperties, setRelatedProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!propertyId) return
      setIsLoading(true)

      const propertyDocRef = doc(db, "imoveis", propertyId)
      const propertyDocSnap = await getDoc(propertyDocRef)
      if (!propertyDocSnap.exists()) {
        notFound()
        return
      }
      const propertyData = { id: propertyDocSnap.id, ...propertyDocSnap.data() } as Property
      setProperty(propertyData)

      if (propertyData.cidade) {
        const relatedQuery = query(
          collection(db, "imoveis"),
          where("cidade", "==", propertyData.cidade),
          where("__name__", "!=", propertyId),
          limit(6)
        );
        const relatedSnapshot = await getDocs(relatedQuery);
        const relatedData = relatedSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Property));
        setRelatedProperties(relatedData);
      }

      const brokersQuery = query(collection(db, "usuarios"), where("visibility.isPublic", "==", true));
      const brokersQuerySnapshot = await getDocs(brokersQuery);
      const brokersData = brokersQuerySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Broker))
      setBrokers(brokersData)
      if (brokersData.length > 0) {
        setSelectedBroker(brokersData[0])
      }
      
      setIsLoading(false)
    }
    fetchData()
  }, [propertyId])

  // Funções de handle...
  const handleWhatsAppContact = () => {
    if (!property || !selectedBroker) return;
    const message = `Olá ${selectedBroker.nome}! Tenho interesse no imóvel: ${property.title} (Ref: ${property.id}). Gostaria de mais informações.`
    const whatsappUrl = `https://wa.me/${selectedBroker.whatsapp}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const handleEmailContact = () => {
    if (!property || !selectedBroker) return;
    const subject = `Interesse no imóvel: ${property.title} (Ref: ${property.id})`
    const body = `Olá ${selectedBroker.nome},\n\nTenho interesse no imóvel "${property.title}" e gostaria de mais informações.\n\nAguardo retorno.\n\nObrigado(a)!`
    window.location.href = `mailto:${selectedBroker.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }
  
  const handleShare = async () => {
    if (!property) return;
    if (navigator.share) {
      await navigator.share({ title: property.title, text: `Confira este imóvel: ${property.title}`, url: window.location.href, });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copiado para a área de transferência!");
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  if (!property) {
    return null; 
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-grow">
        {/* ... (código do imóvel, sem alterações) ... */}
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link href="/imoveis">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Listagem
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <ImageGallery images={property.images} title={property.title} />
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={property.status === "disponivel" ? "default" : "secondary"}>{property.status}</Badge>
                    <Badge variant="outline">{property.type}</Badge>
                  </div>
                  <h1 className="text-3xl font-bold text-secondary mb-2 text-balance">{property.title}</h1>
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4" />
                    <p>{property.bairro}, {property.cidade}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Publicado em {new Date(property.createdAt).toLocaleDateString("pt-BR")}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={handleShare}><Share2 className="h-4 w-4" /></Button>
                </div>
              </div>
              <div className="text-4xl font-bold text-primary">{property.price}</div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-4 text-muted-foreground pt-4 border-t">
                  <div className="flex items-center gap-2"><Bed className="h-5 w-5" /><span>{property.bedrooms} quartos</span></div>
                  <div className="flex items-center gap-2"><Bath className="h-5 w-5" /><span>{property.bathrooms} banheiros</span></div>
                  <div className="flex items-center gap-2"><Square className="h-5 w-5" /><span>{property.area}m²</span></div>
                  <div className="flex items-center gap-2"><Car className="h-5 w-5" /><span>{property.garageSpaces} vagas</span></div>
                  {property.features.map((feature, index) => {
                    const Icon = featureIconMap[feature] || null;
                    return (
                      <div key={index} className="flex items-center gap-2">
                        {Icon && <Icon className="h-5 w-5" />}
                        <span className="text-sm">{feature}</span>
                      </div>
                    )
                  })}
              </div>
              <Separator />
              <div>
                <h2 className="text-2xl font-semibold text-secondary mb-4">Descrição</h2>
                <div className="prose prose-gray max-w-none">
                  {property.description.split("\n").map((paragraph, index) => (
                    <p key={index} className="mb-4 text-muted-foreground leading-relaxed">{paragraph.trim()}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle className="text-center">Fale com um Corretor</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {brokers.map(broker => (
                      <Button key={broker.id} variant={selectedBroker?.id === broker.id ? "default" : "outline"} onClick={() => setSelectedBroker(broker)} className="text-sm">
                        {broker.nome.split(" ")[0]}
                      </Button>
                  ))}
                </div>
                {selectedBroker && (
                  <>
                    {/* <<-- SEÇÃO DO CORRETOR MODIFICADA -->> */}
                    <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={selectedBroker.photo || "/placeholder-user.jpg"} alt={selectedBroker.nome} />
                        <AvatarFallback>{selectedBroker.nome.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{selectedBroker.nome}</h3>
                        <p className="text-sm text-primary font-medium">{selectedBroker.creci}</p>
                      </div>
                      {/* Botões de Redes Sociais */}
                      <div className="flex flex-col gap-1">
                        {selectedBroker.instagram && (
                          <Button asChild variant="ghost" size="icon" className="h-7 w-7">
                            <Link href={selectedBroker.instagram} target="_blank" aria-label="Instagram">
                              {/* Substitua IconInstagram pelo seu componente de ícone real, ex: <SiInstagram /> */}
                              <IconInstagram className="h-4 w-4" />
                            </Link>
                          </Button>
                        )}
                        {selectedBroker.facebook && (
                          <Button asChild variant="ghost" size="icon" className="h-7 w-7">
                            <Link href={selectedBroker.facebook} target="_blank" aria-label="Facebook">
                               {/* Substitua IconFacebook pelo seu componente de ícone real, ex: <SiFacebook /> */}
                              <IconFacebook className="h-4 w-4" />
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <Button onClick={handleWhatsAppContact} className="w-full" size="lg"><MessageCircle className="h-4 w-4 mr-2" />WhatsApp</Button>
                    <Button onClick={handleEmailContact} variant="outline" className="w-full bg-transparent" size="lg"><Mail className="h-4 w-4 mr-2" />E-mail</Button>
                    
                    {/* Novo Botão "Ver Detalhes" */}
                    <Button asChild variant="secondary" className="w-full" size="lg">
                      <Link href="/contato">
                          <Info className="h-4 w-4 mr-2" />
                          Ver Detalhes do Corretor
                      </Link>
                    </Button>

                  </>
                )}
              </CardContent>
            </Card>
            {/* ... (Card de Especificações, sem alterações) ... */}
            <Card>
              <CardHeader><CardTitle>Especificações</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                    <div className="flex justify-between"><span className="text-muted-foreground">Área:</span><span className="font-medium">{property.area} m²</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Quartos:</span><span className="font-medium">{property.bedrooms}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Suítes:</span><span className="font-medium">{property.suites}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Banheiros:</span><span className="font-medium">{property.bathrooms}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Vagas:</span><span className="font-medium">{property.garageSpaces}</span></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* ... (Carrossel, sem alterações) ... */}
        {relatedProperties.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-semibold text-secondary mb-6">Imóveis Semelhantes em {property.cidade}</h2>
            <Carousel
              opts={{
                align: "start",
                loop: relatedProperties.length > 3,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {relatedProperties.map((relatedProperty) => (
                  <CarouselItem key={relatedProperty.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <div className="h-full">
                       <PropertyCard property={{
                          ...relatedProperty,
                          location: `${relatedProperty.bairro}, ${relatedProperty.cidade}`,
                          image: relatedProperty.images[0],
                          status: relatedProperty.status === 'disponivel' ? 'À Venda' : 'Vendido'
                        }} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-[-20px] top-1/2 -translate-y-1/2 hidden sm:flex" />
              <CarouselNext className="absolute right-[-20px] top-1/2 -translate-y-1/2 hidden sm:flex" />
            </Carousel>
          </div>
        )}

      </main>
      <div className="pt-16"></div>
      <Footer />
    </div>
  )
}