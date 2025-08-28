"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, MailCheck } from "lucide-react"
import Link from "next/link"

export default function ConfirmationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-secondary/90 to-accent flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 text-white hover:text-primary transition-colors">
            <Home className="h-8 w-8" />
            <span className="text-2xl font-bold">GR Imóveis</span>
          </Link>
        </div>

        <Card className="shadow-2xl">
          <CardHeader>
            <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
              <MailCheck className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-2xl text-secondary mt-4">Verifique seu E-mail</CardTitle>
            <CardDescription>
              Enviamos um link de recuperação de senha para o seu e-mail. Por favor, verifique sua caixa de entrada e pasta de spam.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" size="lg">
              <Link href="/admin/login">
                Voltar para o Login
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}