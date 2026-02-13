# 📁 Structure du Projet

Vue d'ensemble de l'organisation des fichiers.

## Arborescence

```
training-center-app/
│
├── 📄 Configuration de base
│   ├── package.json              # Dépendances et scripts
│   ├── tsconfig.json             # Configuration TypeScript
│   ├── tsconfig.node.json        # Config TypeScript pour Vite
│   ├── vite.config.ts            # Configuration Vite (build)
│   ├── tailwind.config.js        # Configuration Tailwind CSS
│   ├── postcss.config.js         # Configuration PostCSS
│   ├── .eslintrc.cjs             # Configuration ESLint
│   ├── .gitignore                # Fichiers à ignorer Git
│   └── index.html                # HTML principal
│
├── 📚 Documentation
│   ├── README.md                 # Documentation complète
│   ├── QUICKSTART.md             # Démarrage rapide (5 min)
│   ├── DEPLOYMENT.md             # Guide de déploiement
│   ├── SUPABASE_SETUP.md         # Configuration Supabase
│   ├── PROJECT_STRUCTURE.md      # Ce fichier
│   └── .env.example              # Exemple de variables d'env
│
├── 🗄️ Base de données
│   └── database-schema.sql       # Schéma PostgreSQL complet
│
└── 📦 Code source (src/)
    ├── App.tsx                   # Composant principal
    ├── main.tsx                  # Point d'entrée React
    ├── index.css                 # Styles globaux
    ├── types.ts                  # Types TypeScript
    │
    ├── 🧩 components/            # Composants réutilisables
    │   ├── SessionSelector.tsx   # Sélecteur de session
    │   ├── NewSessionModal.tsx   # Modal pour créer une session
    │   ├── CandidateForm.tsx     # Formulaire candidat
    │   ├── CandidateList.tsx     # Tableau des candidats
    │   └── PaymentForm.tsx       # Formulaire de paiement
    │
    ├── 📄 pages/                 # Pages principales
    │   ├── CandidatesPage.tsx    # Page gestion candidats
    │   ├── PaymentsPage.tsx      # Page suivi paiements
    │   └── DashboardPage.tsx     # Page tableau de bord
    │
    ├── 🔧 lib/                   # Utilitaires et API
    │   ├── supabase.ts           # Client Supabase + requêtes
    │   └── utils.ts              # Fonctions utilitaires
    │
    └── 🪝 hooks/                 # Custom React hooks
        └── useStore.ts           # Gestion d'état global
```

## Description des Fichiers Clés

### Configuration (racine)

| Fichier | Rôle |
|---------|------|
| `package.json` | Dépendances et scripts npm |
| `vite.config.ts` | Config build (optimisation, dev server) |
| `tsconfig.json` | Config du compilateur TypeScript |
| `tailwind.config.js` | Personnalisation des styles Tailwind |
| `.env.example` | Template des variables d'environnement |

### Composants (src/components/)

| Composant | Rôle | Props |
|-----------|------|-------|
| `SessionSelector` | Dropdown pour sélectionner une session | `sessions`, `selectedSessionId`, `onSelectSession` |
| `NewSessionModal` | Modal pour créer une nouvelle session | `isOpen`, `onClose`, `onSubmit` |
| `CandidateForm` | Formulaire pour ajouter/modifier un candidat | `sessionId`, `candidate`, `onSubmit` |
| `CandidateList` | Tableau listant tous les candidats | `candidates`, `onEdit`, `onDelete` |
| `PaymentForm` | Formulaire pour ajouter un paiement | `candidate`, `onSubmit`, `onCancel` |

### Pages (src/pages/)

| Page | Rôle | Features |
|------|------|----------|
| `CandidatesPage` | Gestion des candidats | Créer session, ajouter/modifier/supprimer candidat |
| `PaymentsPage` | Suivi des paiements | Voir paiements par candidat, ajouter paiement |
| `DashboardPage` | Statistiques et rapports | Stats, revenue par mode, export CSV |

### Utilitaires (src/lib/)

| Fichier | Contenu |
|---------|---------|
| `supabase.ts` | Client Supabase + toutes les requêtes API |
| `utils.ts` | Calculs (montants), formatage, export CSV |

### Types (src/types.ts)

Définitions TypeScript pour:
- `Session` - Session de formation
- `Candidate` - Candidat
- `Payment` - Paiement
- `CandidateWithPayments` - Candidat avec ses paiements

### Hooks (src/hooks/)

| Hook | Rôle |
|------|------|
| `useStore` | Gestion d'état (sessions, candidats, paiements) |

## Flux de Données

```
App.tsx
  ├── État global: selectedSessionId
  ├── Onglets: candidates | payments | dashboard
  │
  ├─→ CandidatesPage
  │   ├── SessionSelector
  │   │   └── Charge les sessions (API Supabase)
  │   ├── CandidateForm (modal)
  │   └── CandidateList
  │       └── Affiche candidats de la session
  │
  ├─→ PaymentsPage
  │   ├── Liste des candidats (left sidebar)
  │   ├── PaymentForm (si candidat sélectionné)
  │   └── Tableau des paiements
  │
  └─→ DashboardPage
      ├── Statistiques par session
      ├── Revenue par mode
      ├── Liste candidats non payés
      └── Boutons export CSV
```

## Dépendances Principales

```json
{
  "react": "18.2.0",              // Framework UI
  "react-dom": "18.2.0",          // Rendu React
  "@supabase/supabase-js": "2.38.0" // Client Supabase
}
```

## Scripts Disponibles

```bash
npm run dev          # Lancer le serveur de développement (port 5173)
npm run build        # Compiler pour production
npm run preview      # Prévisualiser la build
npm run lint         # Lancer ESLint
```

## Flux de Déploiement

```
Code local
    ↓
Git push to GitHub
    ↓
Vercel (Frontend)          Supabase (Backend)
    ↓                           ↓
Build & Deploy            Database accessible
    ↓                           ↓
vercel.app                 supabase.co
```

## Conventions de Code

### Nommage
- Composants: PascalCase (`CandidateForm.tsx`)
- Fonctions: camelCase (`fetchCandidates`)
- Constantes: UPPER_SNAKE_CASE (`MAX_LENGTH`)
- Variables booléennes: prefixe `is`/`has` (`isLoading`, `hasError`)

### Organisation des fichiers
- 1 composant par fichier
- Import des types au début du fichier
- Props interface après les imports
- Exporter le composant nommé + defaut

### Types
- Toujours typer les props avec une interface
- Toujours typer les retours de fonction
- Utiliser `React.FC<Props>` pour les composants

## Configuration VS Code Recommandée

Installer les extensions:
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin

Ajouter à `.vscode/settings.json`:
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

## Maintenance et Mise à Jour

### Mettre à jour les dépendances
```bash
npm outdated               # Voir les paquets outdated
npm update                 # Mettre à jour
npm audit fix              # Fixer les vulnérabilités
```

### Ajouter une nouvelle dépendance
```bash
npm install nomdupackage
```

### Optimiser le bundle
```bash
npm run build              # Voir la taille du bundle
```

## Checklist Avant Déploiement

- [ ] `npm run build` passe sans erreurs
- [ ] `npm run lint` ne signale aucun problème
- [ ] `.env.local` n'est pas commité
- [ ] Variables d'env configurées sur Vercel
- [ ] Base de données Supabase créée et testée
- [ ] RLS policies configurées
- [ ] Tests manuels effectués
- [ ] README mis à jour
- [ ] CHANGELOG créé (optionnel)

## Ressources Internes

- [Types système](./src/types.ts)
- [Configuration Supabase](./src/lib/supabase.ts)
- [Utilitaires](./src/lib/utils.ts)
- [État global](./src/hooks/useStore.ts)

## Structure de Branchage Git (Optionnel)

```
main                    # Production (déployé)
  ├── develop          # Développement
  │   ├── feature/...  # Nouvelles features
  │   └── fix/...      # Corrections de bugs
```

---

**Dernière mise à jour**: 2026-02-12
