"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Sparkles } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative gradient-hero min-h-[700px] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full animate-float"></div>
        <div
          className="absolute top-40 right-20 w-24 h-24 bg-accent/20 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-32 left-1/4 w-16 h-16 bg-primary/20 rounded-full animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/modern-city-skyline-silhouette.png')] bg-cover bg-center opacity-15"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center text-white">
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full glass-effect">
            <Sparkles className="h-5 w-5 text-accent" />
            <span className="text-sm font-medium">Plataforma Imobiliária Premium</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-8 text-balance leading-tight">
            Encontre o Imóvel dos Seus{" "}
            <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              Sonhos
            </span>
          </h1>

          <p className="text-xl md:text-2xl mb-12 text-white/90 text-pretty max-w-3xl mx-auto leading-relaxed">
            Sua nova casa está aqui. Descubra as melhores oportunidades do mercado imobiliário com atendimento
            personalizado e tecnologia de ponta.
          </p>

          <div className="glass-effect rounded-2xl p-6 shadow-2xl max-w-3xl mx-auto mb-12 border border-white/20">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  placeholder="Digite o bairro, cidade ou tipo de imóvel..."
                  className="pl-12 h-14 text-foreground bg-white/90 border-0 text-lg rounded-xl"
                />
              </div>
              <Button size="lg" className="h-14 px-10 text-lg rounded-xl animate-pulse-glow">
                <Search className="h-5 w-5 mr-2" />
                Buscar Imóvel
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              asChild
              size="lg"
              className="text-lg px-10 py-4 h-auto rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link href="/imoveis">Ver Todos os Imóveis</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-lg px-10 py-4 h-auto rounded-xl glass-effect border-white/30 text-white hover:bg-white hover:text-secondary transition-all duration-300 bg-transparent"
            >
              <Link href="/contato">Fale Conosco</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
