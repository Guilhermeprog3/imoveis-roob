// app/admin/configuracoes/page.tsx
"use client"
import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/contexts/auth-context"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Home, LogOut, Trash2, Loader2, Shield, Eye } from "lucide-react"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { db } from "@/firebase/config"
import { doc, getDoc, updateDoc } from "firebase/firestore"

// A interface de configurações agora contém apenas isPublic
interface UserSettings {
    visibility: {
        isPublic: boolean;
    };
}

function ConfiguracoesPage() {
  const { user, logout, updateUserPassword, deactivateCurrentUser, deleteCurrentUser } = useAuth()
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isFetching, setIsFetching] = useState(true);

  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        setIsFetching(true);
        const docRef = doc(db, "usuarios", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSettings({
            visibility: data.visibility ? { isPublic: data.visibility.isPublic } : { isPublic: true },
          });
        }
        setIsFetching(false);
      }
    };
    fetchUserData();
  }, [user]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: "As novas senhas não coincidem." });
      return;
    }
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: "A nova senha deve ter pelo menos 6 caracteres." });
      return;
    }
    setActionLoading(true);
    const result = await updateUserPassword(currentPassword, newPassword);
    if (result.success) {
      setMessage({ type: 'success', text: "Senha alterada com sucesso!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setMessage({ type: 'error', text: result.error || "Ocorreu um erro." });
    }
    setActionLoading(false);
  }
  
  const handleDeactivateAccount = async () => {
    setActionLoading(true);
    setMessage(null);
    const result = await deactivateCurrentUser();
    if (!result.success) {
      setMessage({ type: 'error', text: result.error || "Ocorreu um erro ao desativar a conta." });
      setActionLoading(false);
    }
    // O logout e redirecionamento são tratados no AuthProvider
  }

  const handleDeleteAccount = async () => {
     if (deleteConfirmation !== "EXCLUIR") {
        setMessage({ type: 'error', text: "Texto de confirmação inválido." });
        return;
    }
    setActionLoading(true);
    setMessage(null);
    const result = await deleteCurrentUser();
     if (!result.success) {
       setMessage({ type: 'error', text: result.error || "Ocorreu um erro ao excluir a conta." });
       setActionLoading(false);
    }
  }

  // A função de mudança de visibilidade agora altera apenas 'isPublic'
  const handleVisibilityChange = (field: keyof UserSettings['visibility'], value: boolean) => {
    setSettings(prev => {
        if (!prev) return null;
        return {
            ...prev,
            visibility: {
                ...prev.visibility,
                [field]: value,
            }
        };
    });
  };

  const handleSaveChanges = async () => {
      if (!user || !settings) return;
      setActionLoading(true);
      setMessage(null);
      try {
          const userDocRef = doc(db, "usuarios", user.uid);
          await updateDoc(userDocRef, {
              visibility: settings.visibility,
          });
          setMessage({ type: 'success', text: "Configurações salvas com sucesso!" });
      } catch (error) {
          setMessage({ type: 'error', text: "Erro ao salvar as configurações." });
          console.error(error);
      } finally {
          setActionLoading(false);
      }
  }

  if (isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

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
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary">Admin</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="hover:text-primary transition-colors">Dashboard</Link>
              <Link href="/admin/imoveis" className="hover:text-primary transition-colors">Imóveis</Link>
              <span className="text-sm">Olá, {user?.name}</span>
              <Button variant="outline" size="sm" onClick={logout}><LogOut className="h-4 w-4 mr-2" />Sair</Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-secondary mb-2">Configurações</h1>
            <p className="text-muted-foreground">Gerencie as configurações da sua conta.</p>
          </div>
          <Button onClick={handleSaveChanges} disabled={actionLoading}>
            {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Salvar Alterações
          </Button>
        </div>

        <div className="max-w-3xl mx-auto space-y-8">
            {message && (
                <Alert variant={message.type === 'error' ? 'destructive' : 'default'} className="transition-all">
                    <AlertDescription>{message.text}</AlertDescription>
                </Alert>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" /> Segurança da Conta</CardTitle>
                    <CardDescription>Mantenha sua conta segura alterando sua senha regularmente.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div className="space-y-1">
                            <Label htmlFor="currentPassword">Senha atual</Label>
                            <Input id="currentPassword" type="password" placeholder="Digite sua senha atual" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="newPassword">Nova senha</Label>
                            <Input id="newPassword" type="password" placeholder="Digite a nova senha" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
                            <Input id="confirmPassword" type="password" placeholder="Confirme a nova senha" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                        </div>
                        <Button type="submit" disabled={actionLoading}>
                             {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Alterar Senha
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Eye className="h-5 w-5" /> Privacidade e Visibilidade</CardTitle>
                    <CardDescription>Controle como seu perfil aparece na plataforma.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 divide-y divide-border">
                    <div className="flex items-center justify-between pt-4 first:pt-0">
                        <div>
                            <Label htmlFor="isPublic" className="font-medium">Perfil público</Label>
                            <p className="text-sm text-muted-foreground">Seu perfil aparece nas buscas, contato e mapa.</p>
                        </div>
                        <Switch id="isPublic" checked={settings?.visibility.isPublic} onCheckedChange={(checked) => handleVisibilityChange("isPublic", checked)} />
                    </div>
                </CardContent>
            </Card>

            <Card className="border-destructive">
                <CardHeader>
                    <CardTitle className="text-xl text-destructive">Zona de Perigo</CardTitle>
                     <CardDescription>
                        Ações irreversíveis para a sua conta.
                    </CardDescription>
                </CardHeader>
                <CardContent className="divide-y divide-border">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4">
                        <div>
                            <h3 className="font-medium">Desativar conta temporariamente</h3>
                            <p className="text-sm text-muted-foreground mt-1 max-w-lg">
                                Seu perfil ficará oculto e você será deslogado, mas os dados serão preservados.
                            </p>
                        </div>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                               <Button variant="secondary" className="mt-4 sm:mt-0 w-full sm:w-auto">Desativar</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Desativar sua conta?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Você será desconectado e seu perfil ficará inativo. Você poderá reativar sua conta fazendo login novamente e ativando o perfil nas configurações.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeactivateAccount}>
                                    Sim, desativar
                                </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4">
                        <div>
                            <h3 className="font-medium">Excluir conta permanentemente</h3>
                            <p className="text-sm text-muted-foreground mt-1 max-w-lg">
                                Esta ação não pode ser desfeita. Todos os seus dados serão perdidos para sempre.
                            </p>
                        </div>
                         <AlertDialog>
                            <AlertDialogTrigger asChild>
                               <Button variant="destructive" className="mt-4 sm:mt-0 w-full sm:w-auto">
                                   <Trash2 className="h-4 w-4 mr-2" />
                                   Excluir
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Esta ação não pode ser desfeita. Para confirmar, digite <strong>EXCLUIR</strong> abaixo.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <Input
                                    value={deleteConfirmation}
                                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                                    placeholder="EXCLUIR"
                                    className="border-destructive focus-visible:ring-destructive/50"
                                />
                                <AlertDialogFooter>
                                    <AlertDialogCancel onClick={() => setDeleteConfirmation("")}>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDeleteAccount}
                                        disabled={deleteConfirmation !== "EXCLUIR" || actionLoading}
                                        className={buttonVariants({ variant: "destructive" })}
                                    >
                                        {actionLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                                        Confirmar Exclusão
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  )
}

export default function SettingsPageWrapper() {
  return (
    <ProtectedRoute>
      <ConfiguracoesPage />
    </ProtectedRoute>
  )
}