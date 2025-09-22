# GR Imóveis - Plataforma Imobiliária

![Página Principal da GR Imóveis](https://i.imgur.com/URL_DA_SUA_IMAGEM_AQUI.png)
_Substitua o link acima por uma captura de tela da sua página inicial._

## 🚀 Sobre o Projeto

**GR Imóveis** é uma plataforma imobiliária completa e moderna, desenvolvida para simplificar a busca e o gerenciamento de imóveis. O projeto foi construído com as tecnologias mais recentes do ecossistema JavaScript, focando em performance, escalabilidade e uma excelente experiência de usuário.

A aplicação conta com uma área pública para clientes visualizarem os imóveis e uma área administrativa robusta para que os corretores possam gerenciar todo o catálogo, incluindo cadastro, edição e exclusão de propriedades.

---

## ✨ Funcionalidades Principais

### Para Clientes:
- **🏠 Homepage Atraente**: Com imóveis em destaque e seções bem definidas.
- **🔍 Busca e Filtragem Avançada**: Filtros por tipo, cidade, bairro, preço, número de quartos, etc.
- **📃 Página de Detalhes Completa**: Galeria de fotos, descrição, características, mapa de localização e informações do corretor.
- **📱 Design Responsivo**: Experiência otimizada para desktops, tablets e celulares.
- **💬 Contato Facilitado**: Formulário de contato e links diretos para WhatsApp.

### Para Administradores (Corretores):
- **🔐 Autenticação Segura**: Sistema de login com e-mail e senha.
- **📊 Dashboard Intuitivo**: Visão geral com estatísticas e atalhos para as principais ações.
- **➕ Cadastro de Imóveis**: Formulário completo para adicionar novos imóveis, com upload de imagens.
- **✏️ Edição e Exclusão**: Gerenciamento total sobre os imóveis cadastrados.
- **⭐ Sistema de Destaques**: Marque os melhores imóveis para aparecerem na página inicial.
- **👤 Gestão de Perfil**: Administradores podem editar suas próprias informações de contato, que são exibidas publicamente.

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído utilizando as seguintes tecnologias:

- **Framework**: [Next.js](https://nextjs.org/)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **Estilização**: [Tailwind CSS](https://tailwindcss.com/)
- **Componentes UI**: [Shadcn/UI](https://ui.shadcn.com/)
- **Banco de Dados**: [Firebase (Firestore)](https://firebase.google.com/)
- **Autenticação**: [Firebase Authentication](https://firebase.google.com/docs/auth)
- **Armazenamento de Mídia**: [Cloudinary](https://cloudinary.com/) (para upload de imagens dos imóveis)
- **Ícones**: [Lucide React](https://lucide.dev/)
- **Validação de Formulários**: [React Hook Form](https://react-hook-form.com/) e [Zod](https://zod.dev/)

---

## ⚙️ Como Executar o Projeto

Siga os passos abaixo para configurar e executar o projeto em seu ambiente local.

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [pnpm](https://pnpm.io/) (ou npm/yarn)

### 1. Clone o Repositório
```bash
git clone [https://github.com/seu-usuario/gr-imoveis.git](https://github.com/seu-usuario/gr-imoveis.git)
cd gr-imoveis
```

### 2. Instale as Dependências
```bash
pnpm install
```

### 3. Configure as Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz do projeto e adicione as seguintes variáveis, substituindo pelos seus próprios valores:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=SUA_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=SEU_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID=SEU_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=SEU_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=SEU_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=SEU_APP_ID

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=SEU_CLOUD_NAME
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=SEU_UPLOAD_PRESET
```
> **Nota:** As credenciais do Firebase podem ser encontradas no console do seu projeto Firebase, e as do Cloudinary no dashboard da sua conta Cloudinary.

### 4. Execute o Projeto
Com tudo configurado, inicie o servidor de desenvolvimento:

```bash
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver a aplicação em funcionamento.

---

## 👨‍💻 Autor

| [<img src="https://github.com/Guilhermeprog3.png" width="100px;"/><br /><sub><b>Guilherme Silva Rios</b></sub>](https://github.com/Guilhermeprog3) |
| :---: |

Feito com ❤️ por Guilherme Silva Rios.

[![LinkedIn](https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/guilherme-s-rios-dev/)
[![Portfolio](https://img.shields.io/badge/portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://guilhermeriosdev.vercel.app/)