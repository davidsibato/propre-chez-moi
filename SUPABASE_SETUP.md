# Connexion Supabase — Guide pas à pas

## 1. Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com) et créez un compte gratuit
2. Cliquez **New project**
3. Nom : `proprechezvous` — Région : choisissez la plus proche (Europe West)
4. Choisissez un mot de passe fort pour la base de données

## 2. Créer les tables

1. Dans le dashboard, allez dans **SQL Editor**
2. Cliquez **New query**
3. Copiez-collez tout le contenu de `supabase/schema.sql`
4. Cliquez **Run** (▶)

## 3. Récupérer vos clés API

Dans le dashboard Supabase → **Settings** → **API** :

| Variable | Où la trouver |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon / public |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role (**confidentielle**) |

## 4. Configurer l'environnement local

```bash
cp .env.local.example .env.local
# Éditez .env.local et collez vos clés
```

## 5. Configurer l'authentification Supabase

Dans **Authentication** → **URL Configuration** :
- Site URL : `http://localhost:3000` (dev) puis votre domaine en prod
- Redirect URLs : `http://localhost:3000/**`

## 6. Compte admin David Sibato

Après avoir lancé l'app, créez votre compte via `/auth/inscription` avec `davidsibato@gmail.com`.

Ensuite dans le SQL Editor, passez votre rôle en admin :

```sql
update public.profiles
set role = 'admin'
where id = (select id from auth.users where email = 'davidsibato@gmail.com');
```

## 7. Lancer en mode connecté

```bash
npm run dev
```

L'app utilise automatiquement Supabase si `NEXT_PUBLIC_SUPABASE_URL` est défini.
Sans les variables d'environnement, elle tourne en mode démo (données fictives).
