# FutStore

Loja virtual de chuteiras feita com React, Vite, TypeScript, Tailwind CSS e React Router.

A autenticação usa um backend Node local: senhas com PBKDF2-SHA256 (salt aleatório) e sessão em cookie HTTP-only. O arquivo de contas fica em `server/data/users.json` e **não** entra no Git.

## Como rodar

1. Copie o ambiente:

```bash
copy .env.example .env
```

No `.env`, troque `JWT_SECRET` por uma frase longa e aleatória.

2. Instale e suba API + site:

```bash
npm install
npm run dev
```

3. Abra `http://localhost:5173`.

- `/cadastro` — criar conta
- `/entrar` — login
- `/favoritos`, `/checkout` e `/pedido/:id` exigem login
