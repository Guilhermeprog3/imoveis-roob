"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, UserPlus, Loader2 } from "lucide-react"
import Link from "next/link"
import { AdminNavbar } from "@/components/admin-navbar";

function CreateAdminPage() {
  const { signUp } = useAuth()
  const router = useRouter()
  
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    
    if (!name || !email || !password) {
      setError("Todos os campos são obrigatórios.")
      return
    }

    setIsLoading(true)
    const result = await signUp(name, email, password)
    setIsLoading(false)

    if (result.success) {
      setSuccess("Administrador criado com sucesso! Redirecionando...")
      setName("")
      setEmail("")
      setPassword("")
      setTimeout(() => router.push("/admin"), 2000)
    } else {
      setError(result.error || "Ocorreu um erro desconhecido.")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button variant="outline" asChild className="mb-4 bg-transparent">
            <Link href="/admin">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para o Dashboard
            </Link>
          </Button>

          <h1 className="text-3xl font-bold text-secondary mb-2">Criar Novo Administrador</h1>
          <p className="text-muted-foreground">Preencha os dados para cadastrar um novo usuário com acesso administrativo.</p>
        </div>

        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><UserPlus className="h-6 w-6 text-primary" /> Novo Cadastro</CardTitle>
            <CardDescription>O novo usuário terá acesso completo ao painel administrativo.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  disabled={isLoading}
                  required
                />
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando...
                  </>
                ) : (
                  "Criar Administrador"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default function CreateAdminPageWrapper() {
  return (
    <ProtectedRoute>
      <CreateAdminPage />
    </ProtectedRoute>
  )
}