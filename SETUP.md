# AiPosting — Setup Completo
## Do zero ao ar em ~45 minutos

---

## PRÉ-REQUISITO: Instalar Node.js

1. Acesse https://nodejs.org
2. Baixe a versão **LTS** (ex: 20.x)
3. Instale normalmente
4. Verifique: abra o terminal e rode:
   ```
   node -v
   npm -v
   ```
   Ambos devem mostrar um número de versão.

---

## PASSO 1 — Clonar o repositório

No terminal:
```bash
git clone https://github.com/SEU_USUARIO/aiposting.git
cd aiposting
```

---

## PASSO 2 — Instalar dependências

```bash
npm install
```

---

## PASSO 3 — Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Abra o arquivo `.env` num editor de texto e preencha:

```
VITE_SUPABASE_URL=https://aiwgsnhbcfxbvafuwtpj.supabase.co
VITE_SUPABASE_ANON_KEY=sua_nova_chave_anon
VITE_ANTHROPIC_API_KEY=sua_nova_chave_anthropic
VITE_HEYGEN_API_KEY=sua_nova_chave_heygen
VITE_STRIPE_PUBLIC_KEY=sua_nova_chave_stripe_publica
VITE_APP_URL=https://aiposting.leadcultura.com.br
```

⚠️ NUNCA commite o arquivo `.env` no Git. Ele já está no `.gitignore`.

---

## PASSO 4 — Configurar o Supabase

1. Acesse https://supabase.com/dashboard
2. Clique no seu projeto `aiwgsnhbcfxbvafuwtpj`
3. No menu lateral: **SQL Editor** → **New Query**
4. Cole todo o conteúdo do arquivo `supabase/schema.sql`
5. Clique em **Run**
6. Deve aparecer: "Success. No rows returned"

---

## PASSO 5 — Copiar os arquivos de tela

Mova os arquivos JSX para a pasta correta:

```bash
cp viral-os.jsx         src/screens/MainApp.jsx
cp viral-os-roteiro.jsx src/screens/RoteiroScreen.jsx
cp viral-os-ob5.jsx     src/screens/OB5Screen.jsx
cp viral-os-profiles.jsx src/screens/ProfileManager.jsx
cp viral-score-v3.jsx   src/screens/ViralScore.jsx
```

---

## PASSO 6 — Testar local

```bash
npm run dev
```

Abra http://localhost:3000 no navegador.

Você deve ver a tela de login. Crie uma conta com:
- Email: ben@chaagromkt.com.br
- Senha: uma nova senha segura

---

## PASSO 7 — Criar repositório no GitHub

1. Acesse https://github.com/new
2. Nome: `aiposting`
3. Visibilidade: **Private**
4. Não marque nenhuma opção extra
5. Clique em **Create repository**

No terminal:
```bash
git init
git add .
git commit -m "feat: initial AiPosting setup"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/aiposting.git
git push -u origin main
```

---

## PASSO 8 — Deploy no Vercel

1. Acesse https://vercel.com
2. Clique em **Add New Project**
3. Conecte o GitHub e escolha o repositório `aiposting`
4. Em **Environment Variables**, adicione TODAS as variáveis do seu `.env`
5. Clique em **Deploy**

Aguarde ~2 minutos. Vercel vai dar uma URL como: `aiposting.vercel.app`

---

## PASSO 9 — Configurar domínio no Cloudflare

1. No painel Vercel, vá em **Settings → Domains**
2. Adicione: `aiposting.leadcultura.com.br`
3. O Vercel vai mostrar um registro DNS para adicionar

No Cloudflare:
1. Acesse https://dash.cloudflare.com
2. Escolha o domínio `leadcultura.com.br`
3. Vá em **DNS → Add Record**
4. Tipo: `CNAME`
5. Nome: `aiposting`
6. Conteúdo: `cname.vercel-dns.com`
7. Proxy: **DNS only** (nuvem cinza, não laranja)
8. Salvar

Aguarde ~5 minutos. SSL é automático pelo Vercel.

---

## PASSO 10 — Configurar GitHub Actions (deploy automático)

No GitHub:
1. Vá em **Settings → Secrets and variables → Actions**
2. Adicione os seguintes secrets:

| Secret | Onde pegar |
|--------|-----------|
| `VITE_SUPABASE_URL` | Supabase → Settings → API |
| `VITE_SUPABASE_ANON_KEY` | Supabase → Settings → API |
| `VITE_ANTHROPIC_API_KEY` | console.anthropic.com |
| `VITE_HEYGEN_API_KEY` | app.heygen.com/settings |
| `VITE_STRIPE_PUBLIC_KEY` | dashboard.stripe.com |
| `VITE_APP_URL` | https://aiposting.leadcultura.com.br |
| `VERCEL_TOKEN` | vercel.com → Settings → Tokens |
| `VERCEL_ORG_ID` | vercel.com → Settings → General |
| `VERCEL_PROJECT_ID` | Vercel → seu projeto → Settings |

A partir de agora, cada `git push` para `main` faz deploy automático.

---

## RESULTADO ESPERADO

- ✅ https://aiposting.leadcultura.com.br no ar
- ✅ Login com email/senha funcionando
- ✅ Supabase salvando usuários automaticamente
- ✅ Deploy automático a cada push no GitHub

---

## DÚVIDAS FREQUENTES

**"npm: command not found"**
→ Node.js não foi instalado. Volte ao Pré-requisito.

**"Erro de CORS no Supabase"**
→ No Supabase: Authentication → URL Configuration → adicione `https://aiposting.leadcultura.com.br` em Site URL.

**"Deploy falhou no Vercel"**
→ Verifique se todas as variáveis de ambiente foram adicionadas no painel do Vercel.

**"Domínio não abre"**
→ DNS pode levar até 24h para propagar. Teste pelo URL do Vercel primeiro.
