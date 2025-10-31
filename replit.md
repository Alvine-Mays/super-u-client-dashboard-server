# Super-U Staff Dashboard

## Vue d'ensemble
Application de tableau de bord pour le personnel de Super-U avec contrôle d'accès basé sur les rôles. L'application permet la gestion complète des commandes, la validation des codes temporaires, et le suivi de l'activité du personnel.

## Architecture
- **Frontend**: React 18 + TypeScript, TailwindCSS, Shadcn UI, Zustand
- **Backend**: Express.js avec API RESTful
- **Database**: PostgreSQL (Neon)
- **Port**: 3001 (staff frontend), 5000 (backend API)

## Rôles et Permissions

### Administrateur (Admin)
- Accès complet à tous les modules
- Création et gestion du staff (caissiers, préparateurs)
- Vue d'ensemble des KPIs et métriques
- Journal d'activité complet
- Gestion de toutes les commandes

### Caissier (Caissier)
- Validation des codes temporaires des clients
- Génération des codes finaux après validation
- Vue des commandes en attente et confirmées
- Enregistrement des actions dans le journal d'activité

### Préparateur (Préparateur)
- Vue des commandes confirmées à préparer
- Gestion de ses commandes assignées
- Mise à jour du statut de préparation
- Marquage des commandes comme prêtes

## Workflow des Commandes

1. **Commande créée** → Statut: `pending`
2. **Client reçoit code temporaire** (6 chiffres) par SMS
3. **Caissier valide le code** → Statut: `confirmed`, génère code final
4. **Préparateur commence** → Statut: `in_preparation`
5. **Préparation terminée** → Statut: `ready`
6. **Client récupère** → Statut: `completed`

## Fonctionnalités Principales

### Dashboard Admin
- **KPI Cards**: Total commandes, en attente, en préparation, terminées
- **Activité récente**: Timeline des actions du staff
- **Staff actif**: Liste des membres actifs et leurs contributions
- **Charts**: Tendances des commandes, performance du staff

### Interface Caissier
- **Liste des commandes en attente**: Sélection de la commande
- **Validation du code**: Saisie du code temporaire à 6 chiffres
- **Génération du code final**: Automatique après validation réussie
- **Historique**: Vue des validations récentes

### Interface Préparateur
- **Nouvelles commandes**: Commandes confirmées disponibles
- **Mes commandes**: Commandes assignées en cours de préparation
- **Workflow Kanban**: Organisation visuelle des tâches
- **Notes**: Ajout de notes sur la préparation

### Gestion du Staff (Admin uniquement)
- **Création**: Formulaire pour ajouter caissiers/préparateurs
- **Liste**: Vue de tous les membres avec rôles et statuts
- **Recherche**: Filtrage par nom ou email
- **Suppression**: Retrait des membres non-admin

### Journal d'Activité (Admin uniquement)
- **Timeline complète**: Toutes les actions avec horodatage
- **Groupement par date**: Organisation chronologique
- **Détails**: Qui a fait quoi, quand, et sur quoi
- **Recherche**: Filtrage par staff ou type d'action

## Schéma de Données

### Staff Table
```typescript
{
  id: string (UUID)
  email: string (unique)
  password: string (hashed)
  name: string
  phone?: string
  role: 'admin' | 'caissier' | 'preparateur'
  isActive: boolean
  createdAt: timestamp
  createdBy?: string (staff ID)
}
```

### Orders Table
```typescript
{
  id: string (UUID)
  customerName: string
  customerPhone: string
  customerEmail?: string
  items: string (JSON)
  totalAmount: number
  status: 'pending' | 'confirmed' | 'in_preparation' | 'ready' | 'completed' | 'cancelled'
  temporaryCode?: string (6 digits)
  finalCode?: string
  codeValidatedAt?: timestamp
  validatedBy?: string (staff ID)
  assignedTo?: string (staff ID)
  preparedBy?: string (staff ID)
  notes?: string
  createdAt: timestamp
  updatedAt: timestamp
}
```

### Activity Logs Table
```typescript
{
  id: string (UUID)
  staffId: string
  staffName: string
  staffRole: string
  action: string
  entityType: string
  entityId?: string
  details?: string (JSON)
  timestamp: timestamp
}
```

## Design System

### Couleurs
- **Background principal**: Noir (#0A0A0A - hsl(0 0% 4%))
- **Cartes**: Gris très foncé (#121212 - hsl(0 0% 7%))
- **Primary (Rouge)**: hsl(0 88% 56%) - Utilisé pour actions principales
- **Sidebar**: Noir profond (#080808 - hsl(0 0% 3%))
- **Texte**: Blanc cassé (#FAFAFA - hsl(0 0% 98%))

### Typographie
- **Sans**: Inter, IBM Plex Sans
- **Mono**: JetBrains Mono, IBM Plex Mono

### Composants
- **KPI Cards**: Icône + métrique + tendance
- **Order Cards**: Info client + articles + statut + actions
- **Activity Timeline**: Avatar + nom + action + timestamp
- **Badges**: Couleurs par statut (yellow=pending, blue=confirmed, purple=in_preparation, green=ready)

## Routes API (Backend)

### Authentification
- `POST /api/staff/login` - Connexion staff
- `POST /api/staff/logout` - Déconnexion

### Staff Management (Admin only)
- `GET /api/staff/list` - Liste tous les staff
- `POST /api/staff/create` - Créer un nouveau staff
- `DELETE /api/staff/:id` - Supprimer un staff

### Orders
- `GET /api/staff/orders/all` - Toutes les commandes
- `GET /api/staff/orders/pending` - Commandes en attente
- `GET /api/staff/orders/confirmed` - Commandes confirmées
- `GET /api/staff/orders/my-orders` - Mes commandes (préparateur)
- `POST /api/staff/validate-code` - Valider code temporaire
- `POST /api/staff/orders/update-status` - Mettre à jour statut

### Dashboard & Analytics
- `GET /api/staff/dashboard/kpis` - Métriques dashboard
- `GET /api/staff/activity/recent` - Activité récente
- `GET /api/staff/activity/all` - Toute l'activité

## État Actuel du Développement

### Phase 1: Schema & Frontend ✅
- ✅ Schémas TypeScript définis (Staff, Orders, ActivityLogs)
- ✅ Design system noir/rouge configuré
- ✅ Composants réutilisables créés (KPICard, OrderCard, Sidebar)
- ✅ Pages Admin complètes (Dashboard, Staff Management, Activity Logs)
- ✅ Pages Caissier (Validation codes, Orders)
- ✅ Pages Préparateur (Preparation dashboard)
- ✅ Routing avec contrôle d'accès par rôle
- ✅ State management avec Zustand

### Phase 2: Backend (À implémenter)
- Endpoints API pour authentification staff
- CRUD operations pour staff management
- Gestion des commandes et statuts
- Génération et validation des codes
- Activity logging
- KPIs et analytics

### Phase 3: Integration (À faire)
- Connexion frontend-backend
- Tests end-to-end
- Configuration port 3001

## Notes de Développement

- L'application utilise dark mode par défaut
- Tous les composants ont des data-testid pour les tests
- Les mutations invalident automatiquement les queries
- Les erreurs sont affichées via toast notifications
- Format dates en français avec date-fns
