// app/admin/page.tsx
"use client"

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Home, LogOut, Plus, Building, Eye, DollarSign, Settings, EyeOff, User } from "lucide-react"
import Link from "next/link"
import { db } from "@/firebase/config";
import { collection, getDocs, query, limit, orderBy } from "firebase/firestore";

function AdminDashboard() {
  const { user, logout } = useAuth()
  const [stats, setStats] = useState({
    total: 0,
    disponiveis: 0,
    indisponiveis: 0,
    vendidos: 0
  });
  const [recentProperties, setRecentProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      const propertiesRef = collection(db, "imoveis");
      const snapshot = await getDocs(propertiesRef);

      let disponiveis = 0;
      let indisponiveis = 0;
      let vendidos = 0;

      snapshot.docs.forEach(doc => {
          const data = doc.data();
          if (data.status === 'disponivel' || data.status === 'para alugar') {
              disponiveis++;
          } else {
              indisponiveis++;
          }
          if (data.status === 'vendido') {
              vendidos++;
          }
      });

      setStats({
          total: snapshot.size,
          disponiveis,
          indisponiveis,
          vendidos
      });

      const recentQuery = query(propertiesRef, orderBy("createdAt", "desc"), limit(3));
      const recentSnapshot = await getDocs(recentQuery);
      setRecentProperties(recentSnapshot.docs.map(doc => ({id: doc.id, ...doc.data()})));

      setIsLoading(false);
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: "Total de Imóveis",
      value: stats.total,
      description: "Imóveis cadastrados",
      icon: Building,
      color: "text-primary",
    },
    {
      title: "Imóveis Disponíveis",
      value: stats.disponiveis,
      description: "Prontos para venda/locação",
      icon: Eye,
      color: "text-green-600",
    },
    {
      title: "Imóveis Indisponíveis",
      value: stats.indisponiveis,
      description: "Vendidos ou alugados",
      icon: EyeOff,
      color: "text-orange-600",
    },
    {
      title: "Imóveis Vendidos",
      value: stats.vendidos,
      description: "Total de imóveis vendidos",
      icon: DollarSign,
      color: "text-blue-600",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-secondary text-secondary-foreground shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2 hover:text-primary transition-colors">
                <Home className="h-6 w-6" />
                <span className="text-xl font-bold">GR Imóveis</span>
              </Link>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary">
                Admin
              </Badge>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/admin/imoveis" className="hover:text-primary transition-colors">
                Imóveis
              </Link>
              <span className="text-sm">Olá, {user?.name}</span>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary mb-2">Dashboard Administrativo</h1>
          <p className="text-muted-foreground">Gerencie seus imóveis e acompanhe suas vendas</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{isLoading ? '...' : stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
              <CardDescription>Gerencie seus imóveis facilmente</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start" size="lg" asChild>
                <Link href="/admin/imoveis/novo">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Novo Imóvel
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent" size="lg" asChild>
                <Link href="/admin/imoveis">
                  <Building className="h-4 w-4 mr-2" />
                  Gerenciar Imóveis
                </Link>
              </Button>
               <Button variant="outline" className="w-full justify-start bg-transparent" size="lg" asChild>
                <Link href="/admin/editar-perfil">
                    <User className="h-4 w-4 mr-2" />
                    Editar Perfil
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent" size="lg" asChild>
                <Link href="/admin/configuracoes">
                    <Settings className="h-4 w-4 mr-2" />
                    Configurações
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Imóveis Recentes</CardTitle>
              <CardDescription>Últimos imóveis adicionados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoading ? (
                    <p>Carregando...</p>
                ) : (
                    recentProperties.map((property) => (
                      <div key={property.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{property.title}</p>
                          <p className="text-xs text-muted-foreground">{property.price}</p>
                        </div>
                        <Badge
                          variant={property.status === "Disponível" ? "default" : "secondary"}
                          className={property.status === "Disponível" ? "bg-green-600" : "bg-gray-600"}
                        >
                          {property.status}
                        </Badge>
                      </div>
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  )
}