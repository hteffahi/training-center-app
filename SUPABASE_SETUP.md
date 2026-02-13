# 🗄️ Guide de Configuration Supabase

Guide détaillé pour configurer la base de données Supabase.

## Créer un projet Supabase

1. **Aller sur [supabase.com](https://supabase.com)**
   - Cliquer "Sign Up"
   - Créer un compte avec email ou GitHub
   - Vérifier l'email

2. **Créer un nouveau projet**
   - Dashboard > "New Project"
   - Choisir une organisation (créer si nécessaire)
   - Nom du projet: `training-center` (ou votre choix)
   - Database Password: générer un mot de passe sécurisé (sauvegarder!)
   - Region: choisir la plus proche (ex: EU/Ireland pour l'Europe)
   - Attendre 5-10 minutes pour la création

## Exécuter le schéma SQL

### Méthode 1: SQL Editor (Recommandé)

1. **Ouvrir SQL Editor**
   - Dashboard > SQL Editor
   - Cliquer "New query"

2. **Copier-coller le schéma**
   - Copier le contenu complet de `database-schema.sql`
   - Coller dans l'éditeur
   - Cliquer le bouton "Run" (triangle play)

3. **Vérifier l'exécution**
   - Vous devriez voir "Success" message
   - Aller à "Table Editor" pour vérifier les tables

### Méthode 2: via Supabase CLI

```bash
# Installer Supabase CLI
npm install -g supabase

# Se connecter
supabase login

# Lancer le schéma
supabase db push --file database-schema.sql
```

## Vérifier les tables créées

1. **Aller à Table Editor**
   - Dashboard > Table Editor
   - Vous devriez voir 3 tables:
     - `sessions`
     - `candidates`
     - `payments`

2. **Vérifier les colonnes**

   **sessions:**
   - id (uuid)
   - name (text)
   - date (date)
   - created_at (timestamp)

   **candidates:**
   - id (uuid)
   - session_id (uuid, foreign key)
   - nom (text)
   - prenom (text)
   - date_naissance (date)
   - lieu_naissance (text)
   - sexe (text)
   - numero_cnaps (text)
   - niveau_etudes (text)
   - situation_professionnelle (text)
   - created_at (timestamp)

   **payments:**
   - id (uuid)
   - candidate_id (uuid, foreign key)
   - amount (numeric)
   - payment_type (text)
   - mode (text)
   - date (date)
   - status (text)
   - notes (text)
   - created_at (timestamp)

## Obtenir les clés API

### Accéder aux clés

1. **Settings > API**
   - À gauche du dashboard

2. **Copier les valeurs:**

   **Project URL:**
   - Format: `https://[PROJECT_ID].supabase.co`
   - Exemple: `https://abc123xyz.supabase.co`
   - Copier cette URL

   **Keys:**
   - Trouver la section "Project API keys"
   - Copier `anon public` (clé publique)
   - Cette clé est safe pour le frontend

3. **Créer le fichier .env.local**

   ```bash
   # À la racine du projet
   cat > .env.local << EOF
   VITE_SUPABASE_URL=https://abc123xyz.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   EOF
   ```

   ⚠️ **Important:**
   - Ne jamais commit ce fichier
   - Ne jamais partager ces clés publiquement
   - Ajouter `.env.local` à `.gitignore`

## Configurer les politiques RLS (Row Level Security)

### Comprendre les RLS

- **RLS** = contrôle d'accès au niveau des lignes
- Défini qui peut lire/écrire quelles données
- Essentiel pour la sécurité en production

### Vérifier les politiques existantes

Le schéma SQL inclut déjà des politiques simples:

```sql
CREATE POLICY "sessions_all" ON public.sessions
  FOR ALL USING (TRUE);
```

Cela permet à tout le monde de:
- Créer (INSERT)
- Lire (SELECT)
- Modifier (UPDATE)
- Supprimer (DELETE)

⚠️ **Pour la production**, à améliorer avec authentification!

### Améliorer les politiques (Optionnel - Production)

Si vous ajoutez Supabase Auth:

```sql
-- Permettre à l'utilisateur actuel seulement
ALTER POLICY "sessions_all" ON public.sessions
  TO authenticated
  USING (auth.uid() = user_id);
```

## Tester la connexion

### Via l'application

1. **Lancer l'app**
   ```bash
   npm run dev
   ```

2. **Créer une session de test**
   - Aller à l'onglet "Candidats"
   - Cliquer "+ Nouvelle session"
   - Remplir le formulaire
   - Cliquer "Créer"

3. **Vérifier dans Supabase**
   - Aller à Table Editor > sessions
   - Vous devriez voir la nouvelle ligne

### Via SQL

```sql
-- Vérifier les données
SELECT * FROM public.sessions;
SELECT * FROM public.candidates;
SELECT * FROM public.payments;

-- Compter les lignes
SELECT COUNT(*) FROM public.sessions;
```

## Sauvegardes et Backups

### Configurer les backups automatiques

1. **Settings > Database**
   - Scroll down à "Backups"
   - Toggle "Enable Daily Backups"
   - Configurer la rétention (7 jours gratuit)

### Exporter les données manuellement

```bash
# Via CLI
supabase db pull

# Génère une migration SQL
```

## Monitoring et Logs

### Voir les requêtes

1. **Logs > Postgres Logs**
   - Voir toutes les requêtes SQL exécutées
   - Utile pour le debug

2. **Logs > API Logs**
   - Voir les appels API
   - Aider à identifier les problèmes

### Configurer les alertes

- Plan Pro+ uniquement
- Dashboard > Alerts

## Optimisations

### Ajouter des index

Les index sont déjà créés dans le schéma:

```sql
CREATE INDEX idx_candidates_session_id ON public.candidates(session_id);
CREATE INDEX idx_payments_candidate_id ON public.payments(candidate_id);
CREATE INDEX idx_payments_date ON public.payments(date);
```

### Augmenter les limites (si nécessaire)

- Plan Gratuit: 1 GB storage, 2M requêtes/mois
- Limites augmentées automatiquement si besoin
- Pay-as-you-go au-delà

## Troubleshooting

### Erreur: "Missing environment variables"
```
Vérifier:
- .env.local existe
- VITE_SUPABASE_URL est correct
- VITE_SUPABASE_ANON_KEY n'a pas d'espaces
- npm run dev relancé après édition
```

### Erreur: "PostgreSQL error"
```
Vérifier:
- La base de données existe
- Les tables ont été créées
- Les colonnes ont les bons types
- Voir les logs Supabase > Logs
```

### Les données n'apparaissent pas
```
Vérifier:
- Les RLS policies autorisent les lectures
- Les données sont bien dans la table (Table Editor)
- Pas d'erreurs dans la console du navigateur (F12)
```

### Connexion lente
```
Vérifier:
- La région Supabase est la plus proche
- Le réseau est stable
- Vercel et Supabase ne sont pas en maintenance
```

## Sécurité - Checklist

- [ ] `.env.local` ajouté à `.gitignore`
- [ ] `.env.local` n'est pas commité
- [ ] Les clés ne sont pas hardcodées en production
- [ ] RLS policies sont configurées
- [ ] Le mot de passe du projet est sécurisé
- [ ] Les sauvegardes sont activées
- [ ] Les logs sont monitorés

## Intégrations Avancées (Optionnel)

### Ajouter l'authentification Supabase

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(url, key);

// S'identifier
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password',
});
```

### Webhooks (notifications)

- Settings > Webhooks
- Déclencher des actions sur INSERT/UPDATE/DELETE
- Ex: email au paiement reçu

### Réplication (backup)

- Settings > Replication
- Répliquer automatiquement à un autre service

## Ressources

- [Supabase Dashboard](https://app.supabase.com)
- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Supabase CLI Docs](https://supabase.com/docs/reference/cli)

## Coûts Supabase

**Gratuit (Plan Free):**
- 1 GB de stockage
- 50 MB de fichiers
- 2 million de requêtes/mois
- Backups 7 jours

**Pro ($25/mois):**
- 10 GB de stockage
- Backups 30 jours
- Priorité support

**Pay-as-you-go:**
- Au-delà des limites
- $1.25 per million requests
- $0.125 per GB storage

---

**Durée de setup**: 10-15 minutes
