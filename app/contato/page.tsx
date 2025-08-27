"use client"

import type React from "react"
import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, Award } from "lucide-react"
import { NotificationToast } from "@/components/notification-toast"
import { brokers } from "@/lib/data" // Importando os dados dos corretores

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [selectedBroker, setSelectedBroker] = useState(brokers[0])
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setNotification({
        message: `Mensagem enviada com sucesso para ${selectedBroker.name}! Entraremos em contato em breve.`,
        type: "success",
      })
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
      setIsSubmitting(false)
    }, 1500)
  }

  const handleWhatsAppContact = () => {
    const message = `Olá ${selectedBroker.name}! Gostaria de mais informações sobre os imóveis disponíveis.`
    const whatsappUrl = `https://wa.me/${selectedBroker.whatsapp}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {brokers.map((broker) => (
              <Card
                key={broker.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  selectedBroker.id === broker.id
                    ? "ring-2 ring-primary bg-primary/5 shadow-lg"
                    : "hover:shadow-md"
                }`}
                onClick={() => setSelectedBroker(broker)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <img
                      src={broker.photo || "/placeholder.svg"}
                      alt={broker.name}
                      className="w-20 h-20 rounded-full object-cover border-2 border-primary/20"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-secondary mb-1">{broker.name}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-primary">{broker.creci}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{broker.specialties.join(' & ')}</p>
                      <p className="text-sm text-muted-foreground">{broker.experience}</p>
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
                    {selectedBroker.id === broker.id && (
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-8">
            <Card className="gradient-card border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-secondary">Contato - {selectedBroker.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary mb-1">Telefone</h3>
                    <p className="text-muted-foreground">{selectedBroker.phone}</p>
                    <p className="text-muted-foreground">(11) 3333-4444</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary mb-1">E-mail</h3>
                    <p className="text-muted-foreground">{selectedBroker.email}</p>
                    <p className="text-muted-foreground">contato@imovelpro.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary mb-1">Endereço</h3>
                    <p className="text-muted-foreground">
                      Rua das Flores, 123
                      <br />
                      Centro, São Paulo - SP
                      <br />
                      CEP: 01234-567
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary mb-1">Horário de Funcionamento</h3>
                    <p className="text-muted-foreground">
                      Segunda a Sexta: 8h às 18h
                      <br />
                      Sábado: 8h às 14h
                      <br />
                      Domingo: Fechado
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handleWhatsAppContact}
              className="w-full h-14 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              size="lg"
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              Falar com {selectedBroker.name.split(" ")[0]} no WhatsApp
            </Button>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="gradient-card border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-secondary">
                  Envie sua Mensagem para {selectedBroker.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-secondary mb-2">
                        Nome Completo *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="h-12 rounded-xl border-2 focus:border-primary"
                        placeholder="Seu nome completo"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-secondary mb-2">
                        E-mail *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="h-12 rounded-xl border-2 focus:border-primary"
                        placeholder="seu@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-secondary mb-2">
                        Telefone
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="h-12 rounded-xl border-2 focus:border-primary"
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-secondary mb-2">
                        Assunto *
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="h-12 rounded-xl border-2 focus:border-primary"
                        placeholder="Assunto da mensagem"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-secondary mb-2">
                      Mensagem *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="rounded-xl border-2 focus:border-primary resize-none"
                      placeholder="Descreva como podemos ajudá-lo..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Enviar Mensagem
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
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