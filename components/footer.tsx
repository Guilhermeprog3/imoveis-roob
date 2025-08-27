import Link from "next/link"
import { Home, Phone, Facebook, Instagram } from "lucide-react"
import { brokers } from "@/lib/data"

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12">
        {/* Grid principal ajustado para lg:grid-cols-6 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          
          {/* Logo e Descrição: Ocupa 2 colunas em telas grandes */}
          <div className="space-y-4 lg:col-span-2">
            <div className="flex items-center space-x-2">
              <Home className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">GR Imóveis</span>
            </div>
            <p className="text-secondary-foreground/80 text-pretty">
              Sua parceira de confiança no mercado imobiliário. Encontramos o imóvel perfeito para você.
            </p>
          </div>

          {/* Links Rápidos: Ocupa 1 coluna em telas grandes */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/imoveis" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                  Imóveis
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                  Contato
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                  Sobre Nós
                </Link>
              </li>
            </ul>
          </div>

          {/* Serviços: Ocupa 1 coluna em telas grandes */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Serviços</h3>
            <ul className="space-y-2">
              <li className="text-secondary-foreground/80">Compra de Imóveis</li>
              <li className="text-secondary-foreground/80">Venda de Imóveis</li>
              <li className="text-secondary-foreground/80">Locação</li>
              <li className="text-secondary-foreground/80">Avaliação</li>
            </ul>
          </div>

          {/* Contato: Ocupa 2 colunas em telas grandes */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {brokers.map((broker) => (
                <div key={broker.id}>
                  <h4 className="font-semibold text-primary">{broker.name}</h4>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-primary" />
                      <a href={`https://wa.me/${broker.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-secondary-foreground/80 hover:text-primary">
                        {broker.phone}
                      </a>
                    </div>
                    <a href={broker.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-sm text-secondary-foreground/80 hover:text-primary transition-colors">
                      <Facebook className="h-4 w-4" />
                      <span>{broker.facebookUsername}</span>
                    </a>
                    <a href={broker.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-sm text-secondary-foreground/80 hover:text-primary transition-colors">
                      <Instagram className="h-4 w-4" />
                      <span>{broker.instagramUsername}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/20 mt-8 pt-8 text-center">
          <p className="text-secondary-foreground/60">© 2024 GR Imóveis. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}