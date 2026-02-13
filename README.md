# 🏢 Centre de Formation - Système de Gestion des Candidats et Paiements

Une application web complète pour gérer les candidats, les sessions de formation, et le suivi des paiements.

## ✨ Fonctionnalités

### 📋 Gestion des Candidats
- ✅ Créer/modifier/supprimer des sessions de formation
- ✅ Ajouter/modifier/supprimer des candidats par session
- ✅ Gestion complète des informations du candidat (nom, prénom, date/lieu de naissance, sexe, CNAPS, niveau d'études, situation professionnelle)
- ✅ Lister tous les candidats d'une session

### 💳 Suivi des Paiements
- ✅ Enregistrer plusieurs paiements par candidat
- ✅ Types de paiement: Acompte / Solde
- ✅ Modes de paiement: CPF / Espèces / Virement FSIS / Habilitation
- ✅ Statut: Pending / Completed
- ✅ Calcul automatique du montant payé et en attente
- ✅ Vue détaillée par candidat

### 📊 Tableau de Bord & Rapports
- ✅ Statistiques par session (nombre total, payés, en attente, non payés)
- ✅ Revenus par mode de paiement
- ✅ Liste des candidats non payés
- ✅ Export des données en CSV (candidats + paiements)
- ✅ Taux de paiement de la session

## 🛠️ Stack Technologique

- **Frontend**: React 18 + TypeScript
- **Base de données**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Build**: Vite
- **API Client**: @supabase/supabase-js

## 📦 Installation

### Prérequis
- Node.js 16+
- npm ou yarn
- Un compte Supabase (gratuit)

### Étapes

1. **Cloner le projet**
   ```bash
   cd training-center-app
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer Supabase**
   - Créer un compte sur [supabase.com](https://supabase.com)
   - Créer un nouveau projet
   - Exécuter le schéma SQL (voir ci-dessous)
   - Copier les variables d'environnement

4. **Configurer les variables d'environnement**
   ```bash
   cp .env.example .env.local
   ```
   
   Puis éditer `.env.local`:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

5. **Lancer l'application**
   ```bash
   npm run dev
   ```
   
   L'app s'ouvrira automatiquement à `http://localhost:5173`

## 🗄️ Setup Supabase

### 1. Créer les tables

Accédez au SQL Editor dans Supabase et exécutez le contenu de `database-schema.sql`:

```sql
-- Voir le fichier database-schema.sql
```

### 2. Vérifier les politiques RLS

Les politiques RLS sont déjà incluses dans le schéma. Pour la production, adaptez-les selon votre système d'authentification.

### 3. Obtenir les clés

Dans **Settings > API**:
- Copier `Project URL` → `VITE_SUPABASE_URL`
- Copier `anon public` → `VITE_SUPABASE_ANON_KEY`

## 🚀 Déploiement

### Vercel (Frontend)

1. **Push sur GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Importer dans Vercel**
   - Aller sur [vercel.com](https://vercel.com)
   - Cliquer "New Project"
   - Sélectionner le repo GitHub
   - Ajouter les variables d'environnement:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
   - Cliquer "Deploy"

3. **Configurer le domaine**
   - Vercel génère une URL automatiquement
   - Optionnel: configurer un domaine personnalisé

### Supabase (Backend)

- Aucune configuration supplémentaire!
- Supabase héberge la base de données automatiquement
- Plan gratuit suffit pour débuter

## 📖 Guide d'utilisation

### Page 1: Candidats

1. **Créer une session**
   - Cliquer "+ Nouvelle session"
   - Entrer le nom (ex: "Groupe 06/01/2026") et la date
   - Cliquer "Créer"

2. **Ajouter un candidat**
   - Sélectionner une session
   - Cliquer "+ Ajouter un candidat"
   - Remplir tous les champs
   - Cliquer "Ajouter"

3. **Modifier/Supprimer**
   - Cliquer "Modifier" ou "Supprimer" dans le tableau
   - Confirmer l'action

### Page 2: Paiements

1. **Sélectionner un candidat**
   - La liste des candidats s'affiche à gauche
   - Cliquer sur un candidat

2. **Ajouter un paiement**
   - Cliquer "+ Ajouter paiement"
   - Remplir les détails (montant, type, mode, date, statut)
   - Ajouter des notes optionnelles
   - Cliquer "Ajouter paiement"

3. **Voir l'historique**
   - Tous les paiements du candidat s'affichent dans le tableau
   - Le total payé et en attente sont mis à jour automatiquement

### Page 3: Tableau de Bord

1. **Consulter les statistiques**
   - Nombre total de candidats
   - Nombre de candidats payés/en attente/non payés
   - Taux de paiement global

2. **Revenus par mode**
   - Total des paiements complétés par mode (CPF, Espèces, Virement, Habilitation)
   - Total général

3. **Candidats non payés**
   - Tableau avec tous les candidats sans paiement
   - Utile pour le relance

4. **Exporter les données**
   - Cliquer "Exporter les candidats (CSV)"
   - Cliquer "Exporter les paiements (CSV)"
   - Fichiers téléchargés dans le dossier Downloads

## 🎨 Architecture

```
src/
├── components/          # Composants réutilisables
│   ├── SessionSelector.tsx
│   ├── NewSessionModal.tsx
│   ├── CandidateForm.tsx
│   ├── CandidateList.tsx
│   └── PaymentForm.tsx
├── pages/              # Pages principales
│   ├── CandidatesPage.tsx
│   ├── PaymentsPage.tsx
│   └── DashboardPage.tsx
├── lib/
│   ├── supabase.ts     # Client et requêtes API
│   └── utils.ts        # Fonctions utilitaires
├── hooks/
│   └── useStore.ts     # State management
├── types.ts            # Types TypeScript
├── App.tsx             # Composant principal
└── main.tsx            # Point d'entrée

database-schema.sql     # Schéma PostgreSQL
```

## 🔒 Sécurité

- **RLS Policies**: Les tables sont protégées par Row Level Security
- **Validation**: Validation côté client et serveur
- **Données sensibles**: Jamais exposées dans les logs
- **Env vars**: Les clés sont stockées dans `.env.local` (pas de version contrôle)

### Production Security Checklist

- [ ] Configurer les RLS policies correctement
- [ ] Ajouter un système d'authentification (Auth0, Supabase Auth)
- [ ] Activer HTTPS/SSL
- [ ] Configurer les CORS appropriés
- [ ] Mettre en place des sauvegardes
- [ ] Monitorer les logs Supabase

## 📝 Schéma Base de Données

### sessions
```
id (UUID) - Clé primaire
name (VARCHAR) - Nom de la session
date (DATE) - Date de la session
created_at (TIMESTAMP) - Date de création
```

### candidates
```
id (UUID) - Clé primaire
session_id (UUID) - Référence à la session
nom (VARCHAR) - Nom du candidat
prenom (VARCHAR) - Prénom du candidat
date_naissance (DATE) - Date de naissance
lieu_naissance (VARCHAR) - Lieu de naissance
sexe (VARCHAR) - Masculin/Féminin
numero_cnaps (VARCHAR) - Numéro CNAPS
niveau_etudes (VARCHAR) - Niveau d'études
situation_professionnelle (VARCHAR) - Situation professionnelle
created_at (TIMESTAMP) - Date de création
```

### payments
```
id (UUID) - Clé primaire
candidate_id (UUID) - Référence au candidat
amount (DECIMAL) - Montant du paiement
payment_type (VARCHAR) - acompte/solde
mode (VARCHAR) - CPF/Espèces/Virement FSIS/Habilitation
date (DATE) - Date du paiement
status (VARCHAR) - pending/completed
notes (TEXT) - Notes additionnelles
created_at (TIMESTAMP) - Date de création
```

## 🐛 Dépannage

### "Missing Supabase environment variables"
- Vérifier que `.env.local` existe
- Vérifier que `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` sont définis
- Redémarrer le serveur dev

### Erreurs de connexion Supabase
- Vérifier l'URL et les clés (pas d'espaces)
- Vérifier le statut de Supabase ([status.supabase.com](https://status.supabase.com))
- Vérifier les CORS settings dans Supabase

### Les paiements ne s'affichent pas
- Vérifier que les RLS policies autorisent les lectures
- Vérifier les données dans Supabase Table Editor
- Vérifier la console du navigateur pour les erreurs

## 📚 Ressources

- [Supabase Docs](https://supabase.com/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)

## 📧 Support

Pour toute question ou problème, consultez:
1. Les logs de la console du navigateur
2. Les logs Supabase (Settings > Logs)
3. La documentation officielle

## 📄 Licence

MIT License - libre d'utilisation

---

**Version**: 1.0.0  
**Dernière mise à jour**: 2026-02-12
