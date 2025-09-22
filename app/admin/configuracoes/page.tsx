"use client"
import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/contexts/auth-context"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, Loader2, Shield, Eye, EyeOff } from "lucide-react"
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
import { Switch } from "@/components/ui/switch"
import { db } from "@/firebase/config"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { AdminNavbar } from "@/components/admin-navbar"
import { NotificationToast } from "@/components/notification-toast"

interface UserSettings {
    visibility: {
        isPublic: boolean;
    };
}

function ConfiguracoesPage() {
  const { user, updateUserPassword, deactivateCurrentUser, deleteCurrentUser } = useAuth()
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isFetching, setIsFetching] = useState(true);

  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error' | 'info', text: string} | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        setIsFetching(true);
        try {
          const docRef = doc(db, "usuarios", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            const isPublic = data.visibility?.isPublic === true;
            setSettings({ visibility: { isPublic } });
          } else {
            setSettings({ visibility: { isPublic: false } });
          }
        } catch (error) {
          console.error("Erro ao carregar configurações:", error);
          setMessage({ type: 'error', text: "Não foi possível carregar as configurações." });
        } finally {
          setIsFetching(false);
        }
      };
      fetchUserData();
    }
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
    if (result.success) {
        setMessage({ type: 'info', text: "Conta desativada. Você foi desconectado." });
    } else {
      setMessage({ type: 'error', text: result.error || "Ocorreu um erro ao desativar a conta." });
      setActionLoading(false);
    }
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

  const handleVisibilityChange = async (isPublic: boolean) => {
    if (!user) {
      setMessage({ type: 'error', text: "Usuário não autenticado." });
      return;
    }

    setSettings({ visibility: { isPublic } });
    setMessage(null);

    try {
      const userDocRef = doc(db, "usuarios", user.uid);
      await updateDoc(userDocRef, { "visibility.isPublic": isPublic });
      setMessage({ type: 'success', text: `Perfil definido como ${isPublic ? 'público' : 'privado'}.` });
    } catch (error) {
      setMessage({ type: 'error', text: "Erro ao atualizar a visibilidade." });
      console.error(error);
      setSettings({ visibility: { isPublic: !isPublic } }); // Reverte a UI em caso de erro
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar />
      
      {message && (
        <NotificationToast
            message={message.text}
            type={message.type}
            onClose={() => setMessage(null)}
        />
      )}

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary mb-2">Configurações</h1>
          <p className="text-muted-foreground">Gerencie as configurações da sua conta.</p>
        </div>

        <div className="max-w-3xl mx-auto space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" /> Segurança da Conta</CardTitle>
                    <CardDescription>Mantenha sua conta segura alterando sua senha regularmente.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div className="space-y-1">
                            <Label htmlFor="currentPassword">Senha atual</Label>
                            <div className="relative">
                                <Input id="currentPassword" type={showCurrentPassword ? "text" : "password"} placeholder="Digite sua senha atual" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
                                <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                                    {showCurrentPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="newPassword">Nova senha</Label>
                             <div className="relative">
                                <Input id="newPassword" type={showNewPassword ? "text" : "password"} placeholder="Digite a nova senha" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                                <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" onClick={() => setShowNewPassword(!showNewPassword)}>
                                    {showNewPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
                            <div className="relative">
                                <Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="Confirme a nova senha" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                                <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4" />}
                                </Button>
                            </div>
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
                        <Switch id="isPublic" checked={settings?.visibility.isPublic ?? false} onCheckedChange={handleVisibilityChange} />
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
                                <AlertDialogAction onClick={handleDeactivateAccount} disabled={actionLoading}>
                                    {actionLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
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