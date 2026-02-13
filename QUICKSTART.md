# ⚡ Quick Start Guide

Lancez l'application en 5 minutes!

## 1. Cloner et installer

```bash
cd training-center-app
npm install
```

## 2. Créer un projet Supabase

1. Aller sur https://supabase.com
2. Cliquer "Start Your Project"
3. Créer un compte avec GitHub
4. Créer un nouveau projet
5. Attendre 10 minutes

## 3. Configurer la base de données

1. Ouvrir le **SQL Editor** dans Supabase
2. Copier-coller le contenu de `database-schema.sql`
3. Cliquer "Run"

## 4. Obtenir les clés

1. Aller à **Settings > API**
2. Copier:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon public` → `VITE_SUPABASE_ANON_KEY`

## 5. Créer .env.local

```bash
echo "VITE_SUPABASE_URL=https://votre-url.supabase.co" > .env.local
echo "VITE_SUPABASE_ANON_KEY=votre-cle-anon" >> .env.local
```

## 6. Lancer l'app

```bash
npm run dev
```

L'app s'ouvrira automatiquement à http://localhost:5173 ✅

## 7. Tester

1. Créer une session: "+ Nouvelle session"
2. Ajouter un candidat
3. Ajouter un paiement
4. Voir le tableau de bord

## ✨ Voilà!

L'application est prête! 🎉

Pour les détails complets, voir [README.md](./README.md)

### Prochaines étapes:

- [ ] Personnaliser le logo/couleurs
- [ ] Ajouter plus de candidats
- [ ] Configurer les paiements
- [ ] Exporter les données
- [ ] Déployer sur Vercel

### Besoin d'aide?

- 📖 [README.md](./README.md) - Documentation complète
- 🚀 [DEPLOYMENT.md](./DEPLOYMENT.md) - Déployer en production
- 🗄️ [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Configuration avancée
