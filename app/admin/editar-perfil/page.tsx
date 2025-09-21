"use client"
import { useState, useEffect, useRef } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { User, Link as LinkIcon, Camera, Loader2, Clock } from "lucide-react"
import { db } from "@/firebase/config"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { AdminNavbar } from "@/components/admin-navbar"
import { NotificationToast } from "@/components/notification-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"

const formatPhone = (value: string) => {
  if (!value) return ""
  const digitsOnly = value.replace(/\D/g, '')
  if (digitsOnly.length <= 2) return `(${digitsOnly}`
  if (digitsOnly.length <= 7) return `(${digitsOnly.slice(0, 2)}) ${digitsOnly.slice(2)}`
  return `(${digitsOnly.slice(0, 2)}) ${digitsOnly.slice(2, 7)}-${digitsOnly.slice(7, 11)}`
}

const formatCreci = (value: string) => {
  if (!value) return ""
  const cleaned = value.replace(/[^0-9a-zA-Z]/g, '').toUpperCase();
  if (cleaned.length > 5) {
    return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 6)}`;
  }
  return cleaned;
}

interface HorarioDia {
  ativo: boolean;
  inicio: string;
  fim: string;
}

interface HorarioAtendimento {
  segunda: HorarioDia;
  terca: HorarioDia;
  quarta: HorarioDia;
  quinta: HorarioDia;
  sexta: HorarioDia;
  sabado: HorarioDia;
  domingo: HorarioDia;
}

interface BrokerFormData {
    nome: string;
    creci: string;
    phone: string;
    email: string;
    photo: string;
    facebookUsername: string;
    instagramUsername: string;
    horarioAtendimento: HorarioAtendimento;
}

const defaultHorario: HorarioAtendimento = {
  segunda: { ativo: true, inicio: "08:00", fim: "18:00" },
  terca: { ativo: true, inicio: "08:00", fim: "18:00" },
  quarta: { ativo: true, inicio: "08:00", fim: "18:00" },
  quinta: { ativo: true, inicio: "08:00", fim: "18:00" },
  sexta: { ativo: true, inicio: "08:00", fim: "18:00" },
  sabado: { ativo: false, inicio: "09:00", fim: "12:00" },
  domingo: { ativo: false, inicio: "09:00", fim: "12:00" },
};

const diasSemana: { key: keyof HorarioAtendimento; label: string }[] = [
    { key: "segunda", label: "Segunda-feira" },
    { key: "terca", label: "Terça-feira" },
    { key: "quarta", label: "Quarta-feira" },
    { key: "quinta", label: "Quinta-feira" },
    { key: "sexta", label: "Sexta-feira" },
    { key: "sabado", label: "Sábado" },
    { key: "domingo", label: "Domingo" },
];


function EditarPerfilPage() {
  const { user } = useAuth()
  const [formData, setFormData] = useState<BrokerFormData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState<{type: 'success' | 'error' | 'info', text: string} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  useEffect(() => {
    if (user && !initialDataLoaded) {
        const fetchBrokerData = async () => {
            try {
              const docRef = doc(db, "usuarios", user.uid)
              const docSnap = await getDoc(docRef)
              if (docSnap.exists()) {
                const data = docSnap.data()
                setFormData({
                    ...data,
                    phone: data.phone ? formatPhone(data.phone) : '',
                    creci: data.creci ? formatCreci(data.creci) : '',
                    horarioAtendimento: data.horarioAtendimento ? { ...defaultHorario, ...data.horarioAtendimento } : defaultHorario,
                } as BrokerFormData)
              } else {
                console.log("Nenhum documento de usuário encontrado!");
              }
            } catch (error) {
                console.error("Erro ao buscar dados do perfil:", error);
                setMessage({ type: 'error', text: "Não foi possível carregar os dados do perfil." });
            } finally {
                setIsFetching(false);
                setInitialDataLoaded(true);
            }
        }
        fetchBrokerData()
    } else if (!user) {
        setIsFetching(true);
    }
  }, [user, initialDataLoaded])

  const handleInputChange = (field: keyof BrokerFormData, value: any) => {
    let formattedValue = value;
    if (field === 'phone') {
        formattedValue = formatPhone(value);
    } else if (field === 'creci') {
        formattedValue = formatCreci(value);
    }
    setFormData(prev => prev ? { ...prev, [field]: formattedValue } : null)
  }

  const handleHorarioChange = (dia: keyof HorarioAtendimento, campo: keyof HorarioDia, valor: string | boolean) => {
    setFormData(prev => {
        if (!prev) return null;
        return {
            ...prev,
            horarioAtendimento: {
                ...prev.horarioAtendimento!,
                [dia]: {
                    ...prev.horarioAtendimento![dia],
                    [campo]: valor
                }
            }
        };
    });
  };
  
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setMessage(null);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64Image = reader.result as string;

      try {
        const formDataCloudinary = new FormData();
        formDataCloudinary.append('file', base64Image);
        formDataCloudinary.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: 'POST',
            body: formDataCloudinary,
          }
        );

        const result = await response.json();

        if (result.secure_url) {
          handleInputChange('photo', result.secure_url);
          setMessage({ type: 'info', text: "Imagem carregada. Clique em 'Salvar Alterações' para confirmar." });
        } else {
          throw new Error(result.error?.message || 'Falha no upload da imagem.');
        }
      } catch (error) {
        console.error("Erro no upload para o Cloudinary:", error);
        setMessage({ type: 'error', text: "Não foi possível carregar a imagem. Tente novamente." });
      } finally {
        setIsUploading(false);
      }
    };
    reader.onerror = () => {
      console.error("Erro ao ler o arquivo.");
      setMessage({ type: 'error', text: "Erro ao processar o arquivo de imagem." });
      setIsUploading(false);
    };
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !formData) return

    setIsLoading(true)
    setMessage(null)
    
    try {
      const userDocRef = doc(db, "usuarios", user.uid)
      
      const dataToUpdate = {
          ...formData,
          phone: formData.phone.replace(/\D/g, ''),
          creci: formData.creci
      };

      await updateDoc(userDocRef, dataToUpdate)
      setMessage({ type: 'success', text: "Dados salvos com sucesso!" });
    } catch (error) {
      console.error("Erro ao salvar dados:", error)
      setMessage({ type: 'error', text: "Falha ao salvar as alterações." });
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching || !formData) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar />

      {message && (
        <NotificationToast
            message={message.text}
            type={message.type as "success" | "error" | "info"}
            onClose={() => setMessage(null)}
        />
      )}

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary mb-2">Editar Perfil</h1>
          <p className="text-muted-foreground">Gerencie suas informações pessoais e de contato.</p>
        </div>

        <form onSubmit={handleSaveChanges}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 flex flex-col gap-8">
              <Card>
                <CardHeader className="text-center"><CardTitle>Foto de Perfil</CardTitle></CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <Avatar className="h-32 w-32 border-4 border-primary/20">
                      <AvatarImage src={formData.photo} alt={formData.nome} />
                      <AvatarFallback>{formData.nome?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleImageUpload} 
                      className="hidden" 
                      accept="image/png, image/jpeg, image/webp"
                    />
                    <Button 
                      type="button" 
                      size="icon" 
                      className="absolute bottom-1 right-1 h-8 w-8 rounded-full" 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                    </Button>
                  </div>
                   <p className="text-sm text-muted-foreground text-center">Clique na câmera para alterar sua foto.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5 text-primary" /> Horário de Atendimento</CardTitle>
                  <CardDescription>Defina os dias e horários que você está disponível.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {diasSemana.map(({ key, label }) => (
                    <div key={key}>
                      <div className="grid grid-cols-3 items-center gap-4">
                        <div className="flex items-center gap-3 col-span-1">
                            <Checkbox 
                                id={`ativo-${key}`} 
                                checked={formData.horarioAtendimento[key].ativo} 
                                onCheckedChange={(checked) => handleHorarioChange(key, 'ativo', !!checked)}
                            />
                            <Label htmlFor={`ativo-${key}`} className="font-medium">{label}</Label>
                        </div>
                        <div className="flex items-center gap-2 col-span-2">
                            <Input 
                                type="time" 
                                id={`inicio-${key}`}
                                value={formData.horarioAtendimento[key].inicio}
                                onChange={(e) => handleHorarioChange(key, 'inicio', e.target.value)}
                                disabled={!formData.horarioAtendimento[key].ativo}
                                className="w-full"
                            />
                            <span className="text-muted-foreground">às</span>
                            <Input 
                                type="time" 
                                id={`fim-${key}`}
                                value={formData.horarioAtendimento[key].fim}
                                onChange={(e) => handleHorarioChange(key, 'fim', e.target.value)}
                                disabled={!formData.horarioAtendimento[key].ativo}
                                className="w-full"
                            />
                        </div>
                      </div>
                      {key !== 'domingo' && <Separator className="mt-4" />}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><User className="h-5 w-5 text-primary" /> Dados Pessoais</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input id="name" value={formData.nome} onChange={(e) => handleInputChange('nome', e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" value={formData.email} disabled />
                    </div>
                  </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="phone">Telefone / WhatsApp</Label>
                      <Input id="phone" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} />
                    </div>
                     <div className="space-y-1">
                      <Label htmlFor="creci">CRECI</Label>
                      <Input id="creci" value={formData.creci} onChange={(e) => handleInputChange('creci', e.target.value)} />
                    </div>
                  </div>
                </CardContent>
              </Card>

               <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><LinkIcon className="h-5 w-5 text-primary" /> Redes Sociais</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="facebookUsername">Usuário do Facebook</Label>
                      <Input id="facebookUsername" value={formData.facebookUsername} onChange={(e) => handleInputChange('facebookUsername', e.target.value)} placeholder="ex: seu.nome" />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="instagramUsername">Usuário do Instagram</Label>
                      <Input id="instagramUsername" value={formData.instagramUsername} onChange={(e) => handleInputChange('instagramUsername', e.target.value)} placeholder="ex: seu_nome" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button type="submit" size="lg" disabled={isLoading || isUploading}>
                  {isLoading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Salvando...</> : 'Salvar Alterações'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}

export default function EditarPerfilPageWrapper() {
  return (
    <ProtectedRoute>
      <EditarPerfilPage />
    </ProtectedRoute>
  )
}