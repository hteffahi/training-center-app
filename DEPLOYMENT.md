# 📦 Guide de Déploiement

Ce guide détaille comment déployer l'application sur Vercel (frontend) et Supabase (backend).

## Prérequis

- Compte GitHub avec un repo pour le projet
- Compte Vercel (gratuit)
- Compte Supabase (gratuit)

## 1. Préparer le code

### Initialiser Git
```bash
git init
git add .
git commit -m "Initial commit: training center app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/training-center-app.git
git push -u origin main
```

### Vérifier la structure
```
training-center-app/
├── src/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── database-schema.sql
├── .env.example
└── README.md
```

## 2. Configurer Supabase (Backend)

### Créer un projet
1. Aller sur [supabase.com](https://supabase.com)
2. Cliquer "New project"
3. Choisir une organisation et un nom
4. Configurer le mot de passe (à sauvegarder!)
5. Sélectionner la région (plus proche = mieux)
6. Cliquer "Create new project" et attendre 5-10 min

### Créer la base de données
1. Ouvrir le **SQL Editor**
2. Cliquer "New query"
3. Copier-coller le contenu de `database-schema.sql`
4. Cliquer "Run"
5. Vérifier que les tables ont été créées (Table Editor)

### Obtenir les clés API
1. Aller à **Settings > API**
2. Copier:
   - `Project URL` (example: `https://abc123.supabase.co`)
   - `anon public` key (long string)
3. Sauvegarder ces valeurs

### Tester la connexion
1. Créer un fichier `.env.local` à la racine:
   ```
   VITE_SUPABASE_URL=https://abc123.supabase.co
   VITE_SUPABASE_ANON_KEY=your-long-anon-key
   ```
2. Lancer `npm run dev` et vérifier qu'il n'y a pas d'erreurs
3. La page doit charger sans erreurs de connexion

## 3. Déployer sur Vercel (Frontend)

### Méthode 1: Via Interface Web

1. **Créer un compte**
   - Aller sur [vercel.com](https://vercel.com)
   - Cliquer "Sign Up"
   - Connecter avec GitHub

2. **Importer le repo**
   - Cliquer "New Project"
   - Sélectionner le repo `training-center-app`
   - Cliquer "Import"

3. **Configurer les variables**
   - Dans "Environment Variables":
     ```
     VITE_SUPABASE_URL=https://abc123.supabase.co
     VITE_SUPABASE_ANON_KEY=your-long-anon-key
     ```
   - Cliquer "Deploy"

4. **Attendre le déploiement**
   - Vercel construit l'app automatiquement
   - Une URL est générée (ex: `training-center-app.vercel.app`)
   - La page est en ligne après 2-5 minutes

### Méthode 2: Via CLI

```bash
# Installer Vercel CLI
npm i -g vercel

# Deployer
vercel

# Entrer les paramètres et les variables d'env
# Suivre les instructions
```

### Tester le déploiement
- Ouvrir l'URL générée par Vercel
- Créer une session de test
- Ajouter un candidat
- Vérifier que les données s'enregistrent

## 4. Configurer un domaine personnalisé (Optionnel)

### Ajouter un domaine
1. Dans Vercel > Settings > Domains
2. Entrer votre domaine (ex: `candidats.monentreprise.com`)
3. Suivre les instructions DNS

### Configurer le DNS (Registrar)
- Ajouter les enregistrements CNAME fournis par Vercel
- Attendre 24-48h pour la propagation DNS

## 5. Configuration Post-Déploiement

### Activer les backups Supabase
1. Aller à Supabase > Settings > Database
2. Cocher "Enable Daily Backups"
3. Configurer la rétention (7 jours gratuit)

### Configurer les emails (Optionnel)
1. Supabase > Authentication > Email Templates
2. Personnaliser les templates si nécessaire

### Monitorer les logs
1. Supabase > Logs pour voir l'activité
2. Vercel > Analytics pour voir le trafic

## 6. Mettre à jour le code

### Ajouter des fonctionnalités
1. Modifier le code localement
2. Tester avec `npm run dev`
3. Commiter et pousser:
   ```bash
   git add .
   git commit -m "Feature: description"
   git push
   ```
4. Vercel redéploie automatiquement

### Rollback en cas de problème
1. Aller à Vercel > Deployments
2. Cliquer sur un deployment antérieur
3. Cliquer "Rollback"

## 7. Checkliste Sécurité

- [ ] `.env.local` est dans `.gitignore`
- [ ] `.env.example` ne contient que des valeurs de placeholder
- [ ] RLS policies sont configurées dans Supabase
- [ ] Vercel a les bonnes variables d'env
- [ ] HTTPS est activé (automatique sur Vercel)
- [ ] Pas de secrets dans le code
- [ ] Pas d'API keys exposées dans les logs

## 8. Optimisations

### Améliorer les performances
```bash
# Vérifier la taille du bundle
npm run build

# Optimiser les images si ajoutées
# Utiliser la lazy loading pour les requêtes
```

### Ajouter un CDN
- Vercel inclut automatiquement un CDN global
- Les images sont servies depuis les serveurs les plus proches

## 9. Dépannage Déploiement

### Build échoue
```
Vérifier:
- Pas d'erreurs TypeScript: npm run build
- Les dépendances sont installées
- package.json a les bon scripts
```

### Application blanche au déploiement
```
Vérifier:
- Les variables d'env sont bien configurées
- Pas d'erreurs dans la console (F12)
- Le repo est le bon
```

### Erreurs Supabase
```
Vérifier:
- Les clés API sont correctes (pas de typos)
- La base de données existe et est accessible
- RLS policies autorisent les opérations
```

## 10. Monitoring

### Configuré les alertes Vercel
1. Vercel > Settings > Notifications
2. Activer les emails pour les déploiements échoués
3. Configurer les webhooks (optionnel)

### Monitorer les erreurs Supabase
1. Supabase > Logs
2. Observer les erreurs de requête
3. Configurer les alertes (plan Pro)

## Estimation des Coûts

**Gratuit pour:**
- Frontend (Vercel): 100 GB/mois bandwidth
- Database (Supabase): 1 GB stockage, 2M requêtes/mois

**Coûts typiques:**
- Très petit usage: Gratuit
- Usage moyen (100 candidats): $10-20/mois
- Usage élevé: Payer à l'usage

## Support et Ressources

- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Deployment Guide](https://supabase.com/docs/guides/cli/deployment)
- [GitHub Pages & Vercel Integration](https://vercel.com/docs/concepts/git)

---

**Durée estimée**: 15-30 minutes pour le déploiement complet
