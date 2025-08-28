"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Home, SearchX, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="text-center max-w-lg">
          <div className="mx-auto bg-primary/10 p-6 rounded-full w-fit mb-8">
            <SearchX className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4">
            Imóvel Não Encontrado
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            O imóvel que você está procurando não existe, foi vendido ou o link expirou. Que tal começar uma nova busca?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="h-12 text-base">
              <Link href="/imoveis">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Ver Todos os Imóveis
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 text-base bg-transparent">
              <Link href="/">
                <Home className="h-5 w-5 mr-2" />
                Página Inicial
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}