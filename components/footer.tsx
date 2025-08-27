import Link from "next/link"
import { Home, Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Home className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">ImóvelPro</span>
            </div>
            <p className="text-secondary-foreground/80 text-pretty">
              Sua parceira de confiança no mercado imobiliário. Encontramos o imóvel perfeito para você.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-secondary-foreground/60 hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-secondary-foreground/60 hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-secondary-foreground/60 hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links Rápidos */}
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

          {/* Serviços */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Serviços</h3>
            <ul className="space-y-2">
              <li className="text-secondary-foreground/80">Compra de Imóveis</li>
              <li className="text-secondary-foreground/80">Venda de Imóveis</li>
              <li className="text-secondary-foreground/80">Locação</li>
              <li className="text-secondary-foreground/80">Avaliação</li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-secondary-foreground/80">(11) 99999-9999</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-secondary-foreground/80">contato@imovelpro.com</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-primary mt-1" />
                <span className="text-secondary-foreground/80">
                  Rua das Flores, 123
                  <br />
                  São Paulo, SP
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/20 mt-8 pt-8 text-center">
          <p className="text-secondary-foreground/60">© 2024 ImóvelPro. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
