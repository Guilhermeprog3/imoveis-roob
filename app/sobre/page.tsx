"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Home, Linkedin, Github, Briefcase } from "lucide-react"
import Link from "next/link"

export default function SobrePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <section className="bg-slate-50 py-20 text-center">
          <div className="container mx-auto px-4">
            <Home className="h-16 w-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4">
              Sobre a GR Imóveis
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Nossa missão é transformar o complexo processo de encontrar um imóvel em uma jornada simples, agradável e segura.
            </p>
          </div>
        </section>

        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-8 text-lg text-foreground/80 text-pretty">
              <p>
                Acreditamos que a busca pela casa dos sonhos deve ser uma experiência emocionante e não uma dor de cabeça. Por isso, criamos a GR Imóveis, uma plataforma moderna e intuitiva que conecta você aos melhores imóveis da região.
              </p>
              <p>
                Utilizamos tecnologia de ponta para oferecer filtros avançados, fotos de alta qualidade e todas as informações que você precisa para tomar a melhor decisão. Nosso compromisso é com a transparência, a confiança e, acima de tudo, com a sua satisfação.
              </p>
              <p>
                Seja para comprar, vender ou alugar, estamos aqui para oferecer o suporte necessário em cada etapa do caminho.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-24">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                     <h2 className="text-3xl font-bold text-secondary">Quem Criou a Plataforma</h2>
                </div>
                <Card className="max-w-lg mx-auto shadow-xl overflow-hidden transform transition-all hover:scale-105 duration-300">
                    <div className="bg-secondary h-24" />
                    <CardContent className="text-center px-6 py-8 relative">
                        <Avatar className="h-32 w-32 mx-auto -mt-20 border-8 border-white shadow-lg">
                            <AvatarImage src="https://github.com/Guilhermeprog3.png" alt="Guilherme Silva Rios" />
                            <AvatarFallback>GR</AvatarFallback>
                        </Avatar>
                        <h3 className="text-2xl font-bold text-secondary mt-6 mb-2">
                            Guilherme Silva Rios
                        </h3>
                        <p className="text-muted-foreground mb-6">
                            Desenvolvedor Full Stack & Criador da GR Imóveis
                        </p>
                        <div className="flex justify-center gap-4">
                            <Button asChild variant="outline" className="bg-transparent">
                                <Link href="https://guilhermeriosdev.vercel.app" target="_blank">
                                    <Briefcase className="h-4 w-4 mr-2" /> Portfólio
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="bg-transparent">
                                <Link href="https://www.linkedin.com/in/guilherme-s-rios-dev/" target="_blank">
                                    <Linkedin className="h-4 w-4 mr-2" /> LinkedIn
                                </Link>
                            </Button>
                             <Button asChild variant="outline" className="bg-transparent">
                                <Link href="https://github.com/Guilhermeprog3" target="_blank">
                                    <Github className="h-4 w-4 mr-2" /> GitHub
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}