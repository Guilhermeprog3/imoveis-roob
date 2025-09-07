// app/contato/page.tsx
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, Mail, Clock, MessageSquare, Send, Award, Facebook, Instagram, Loader2 } from "lucide-react"
import { NotificationToast } from "@/components/notification-toast"
import { db } from "@/firebase/config"
import { collection, getDocs } from "firebase/firestore"

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
  facebook: string;
  instagram: string;
  facebookUsername: string;
  instagramUsername: string;
}

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const [brokers, setBrokers] = useState<Broker[]>([])
  const [selectedBroker, setSelectedBroker] = useState<Broker | null>(null)
  const [isLoadingBrokers, setIsLoadingBrokers] = useState(true)
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchBrokers = async () => {
      setIsLoadingBrokers(true)
      try {
        const querySnapshot = await getDocs(collection(db, "usuarios"))
        const brokersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Broker))
        setBrokers(brokersData)
        if (brokersData.length > 0) {
          setSelectedBroker(brokersData[0])
        }
      } catch (error) {
        console.error("Erro ao buscar corretores:", error)
      } finally {
        setIsLoadingBrokers(false)
      }
    }

    fetchBrokers()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedBroker) return;
    
    setIsSubmitting(true)

    const whatsappMessage = `
      Olá, ${selectedBroker.nome}!
      *Nome:* ${formData.name}
      *Email:* ${formData.email}
      *Telefone:* ${formData.phone}
      *Assunto:* ${formData.subject}
      *Mensagem:*
      ${formData.message}
    `
    const whatsappUrl = `https://wa.me/${selectedBroker.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`
    window.open(whatsappUrl, "_blank")

    setTimeout(() => {
      setNotification({
        message: `Sua mensagem está pronta para ser enviada para ${selectedBroker.nome} no WhatsApp!`,
        type: "success",
      })
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
      setIsSubmitting(false)
    }, 1000)
  }

  const handleWhatsAppContact = () => {
    if (!selectedBroker) return;
    const message = `Olá ${selectedBroker.nome}! Gostaria de mais informações sobre os imóveis disponíveis.`
    const whatsappUrl = `https://wa.me/${selectedBroker.whatsapp}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-secondary">
            Entre em <span className="text-primary">Contato</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            Estamos aqui para ajudá-lo a encontrar o imóvel perfeito. Entre em contato conosco e descubra como podemos
            realizar o seu sonho da casa própria.
          </p>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-secondary mb-6 text-center">Escolha seu Corretor</h2>
          {isLoadingBrokers ? (
            <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {brokers.map((broker) => (
                <Card
                  key={broker.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    selectedBroker?.id === broker.id
                      ? "ring-2 ring-primary bg-primary/5 shadow-lg"
                      : "hover:shadow-md"
                  }`}
                  onClick={() => setSelectedBroker(broker)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <img
                        src={broker.photo || "/placeholder-user.jpg"}
                        alt={broker.nome}
                        className="w-20 h-20 rounded-full object-cover border-2 border-primary/20"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-secondary mb-1">{broker.nome}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <Award className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium text-primary">{broker.creci}</span>
                        </div>
                        {broker.specialties && <p className="text-sm text-muted-foreground mb-1">{broker.specialties.join(' & ')}</p>}
                        {broker.experience && <p className="text-sm text-muted-foreground">{broker.experience}</p>}
                        <div className="flex items-center gap-4 mt-3 text-sm">
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3 text-primary" />
                            <span className="text-muted-foreground">{broker.phone}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3 text-primary" />
                            <span className="text-muted-foreground">{broker.email}</span>
                          </div>
                        </div>
                      </div>
                      {selectedBroker?.id === broker.id && (
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {selectedBroker && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1 space-y-8">
              <Card className="gradient-card border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-secondary">Informações de Contato</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg"><Phone className="h-6 w-6 text-primary" /></div>
                      <div>
                          <h3 className="font-semibold text-secondary mb-1">Telefone</h3>
                          <p className="text-muted-foreground">{selectedBroker.phone}</p>
                      </div>
                  </div>
                   <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg"><Mail className="h-6 w-6 text-primary" /></div>
                      <div>
                          <h3 className="font-semibold text-secondary mb-1">E-mail</h3>
                          <p className="text-muted-foreground">{selectedBroker.email}</p>
                      </div>
                  </div>
                  <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg"><Facebook className="h-6 w-6 text-primary" /></div>
                      <div>
                          <h3 className="font-semibold text-secondary mb-1">Facebook</h3>
                          <a href={selectedBroker.facebook} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">{selectedBroker.facebookUsername}</a>
                      </div>
                  </div>
                  <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg"><Instagram className="h-6 w-6 text-primary" /></div>
                      <div>
                          <h3 className="font-semibold text-secondary mb-1">Instagram</h3>
                          <a href={selectedBroker.instagram} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">{selectedBroker.instagramUsername}</a>
                      </div>
                  </div>
                  <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg"><Clock className="h-6 w-6 text-primary" /></div>
                      <div>
                          <h3 className="font-semibold text-secondary mb-1">Horário de Funcionamento</h3>
                          <p className="text-muted-foreground">Atendimento todos os dias</p>
                      </div>
                  </div>
                </CardContent>
              </Card>

              <Button onClick={handleWhatsAppContact} className="w-full h-14 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300" size="lg">
                <MessageSquare className="h-5 w-5 mr-2" />
                Falar com {selectedBroker.nome.split(" ")[0]} no WhatsApp
              </Button>
            </div>

            <div className="lg:col-span-2">
              <Card className="gradient-card border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-secondary">
                    Envie sua Mensagem para {selectedBroker.nome}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-secondary mb-2">Nome Completo *</label>
                            <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required className="h-12 rounded-xl border-2 focus:border-primary" placeholder="Seu nome completo" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-secondary mb-2">E-mail *</label>
                            <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required className="h-12 rounded-xl border-2 focus:border-primary" placeholder="seu@email.com" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-secondary mb-2">Telefone</label>
                            <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} className="h-12 rounded-xl border-2 focus:border-primary" placeholder="(11) 99999-9999" />
                        </div>
                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-secondary mb-2">Assunto *</label>
                            <Input id="subject" name="subject" value={formData.subject} onChange={handleInputChange} required className="h-12 rounded-xl border-2 focus:border-primary" placeholder="Assunto da mensagem" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-secondary mb-2">Mensagem *</label>
                        <Textarea id="message" name="message" value={formData.message} onChange={handleInputChange} required rows={6} className="rounded-xl border-2 focus:border-primary resize-none" placeholder="Descreva como podemos ajudá-lo..." />
                    </div>
                    <Button type="submit" disabled={isSubmitting} className="w-full h-14 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300" size="lg">
                      {isSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enviando...</>) : (<><Send className="h-5 w-5 mr-2" />Enviar Mensagem</>)}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>

      <Footer />

      {notification && (
        <NotificationToast
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  )
}