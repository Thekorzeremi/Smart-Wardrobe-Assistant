 
# Smart Wardrobe Assistant 👔🌦️

[![Status](https://img.shields.io/badge/status-en%20développement-yellow)]()
[![React Native](https://img.shields.io/badge/React%20Native-0.81-blue)]()

> Application mobile qui vous aide à choisir la tenue parfaite chaque jour, en fonction de votre garde-robe et de la météo, grâce à l’intelligence artificielle.

---

## 📌 Contexte & objectifs

**Smart Wardrobe Assistant** est une application développée dans le cadre d’un projet React Native.  
L’objectif est simple : à partir des vêtements que vous enregistrez et des conditions météo réelles, une IA vous suggère une tenue adaptée et vous explique son choix.

---

## ✨ Fonctionnalités implémentées

| Fonctionnalité | État |
|----------------|------|
| Connexion / inscription (email + password) | ✅ |
| Météo temps réel (température, pluie, vent, UV…) | ✅ |
| Suggestion de tenue du jour par IA | ✅ |
| Filtres (occasion, style) pour la suggestion | ✅ |
| Rafraîchissement quotidien automatique (à 5h) | ✅ |
| Consultation de la garde-robe | ✅ |
| Ajout / modification / suppression d’un vêtement | ✅ |
| Détail d’un vêtement | ✅ |
| Photo réelle des vêtements (appareil photo + stockage Supabase) | ✅ |
| Profil utilisateur (avatar, nom, localisation) | ✅ |
| Modification des infos profil | ✅ |
| Suppression de compte | ✅ |
| Mot de passe oublié | ✅ |
| Déconnexion | ✅ |

### ⏳ Fonctionnalités à venir

| Fonctionnalité | Statut | Détails |
|----------------|--------|---------|
| Suggestion pour une journée précise (météo sur plusieurs jours) | 🔄 En développement | Prévisions météo sur 5 jours + sélection date calendrier |
| Notifications quotidiennes | 📅 Planifié | Rappel pour consulter la suggestion du jour |
| Mode hors-ligne amélioré | 📅 Planifié | Cache intelligent pour accès sans connexion |
| Tests automatisés | 📅 Planifié | Tests unitaires et E2E avec Jest/Detox |

---

## 🧱 Stack technique

- **Frontend** : React Native (Expo) + React Navigation + React Query
- **Backend & Auth** : Supabase (authentification, base de données, storage)
- **Météo** : Open-Meteo (gratuit, sans clé)
- **IA** : n8n (workflow) + OpenRouter (Gemini 2.0 Flash Lite)
- **Stockage local** : AsyncStorage (session, cache)
- **Icônes & UI** : Lucide React Native, Expo Blur, Linear Gradient

---

## 📊 État du projet

Le projet est **en développement avancé** avec 95% des fonctionnalités core implémentées.

### ✅ Sécurité implémentée
- **Policies RLS** activées sur toutes les tables Supabase (`users`, `clothes`, `daily_suggestions`)
- **Edge Functions** pour les opérations sensibles (suppression de compte, réinitialisation mot de passe)
- **Bucket Supabase Storage** fonctionnel pour les photos de vêtements (`clothes_image`)
- **Authentification** sécurisée avec hashage des mots de passe

### ✅ Fonctionnalités opérationnelles
- Suggestion IA quotidienne avec persistance en base de données
- CRUD complet des vêtements avec upload photo
- Météo temps réel avec géolocalisation
- Cache intelligent (React Query + DB caching)
- Interface moderne avec glassmorphism et animations

### 🔄 En cours de développement
- Suggestion pour dates futures (prévisions météo multi-jours)
- Optimisations performances et UX

---

## 🚀 Installation et lancement

### Prérequis

- Node.js (18+)
- Expo CLI (`npm install -g expo-cli`)
- Un compte [Supabase](https://supabase.com) (gratuit)
- Un compte [OpenRouter](https://openrouter.ai) (clé API)

### Étapes

```bash
git clone https://github.com/Thekorzeremi/Smart-Wardrobe-Assistant.git
cd Smart-Wardrobe-Assistant
npm install
```

### Configuration des variables d’environnement

Créez un fichier `.env` à la racine avec les variables suivantes :

```env
# ⚠️ Configuration Supabase (obligatoire)
EXPO_PUBLIC_SUPABASE_URL=https://votre_projet.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=votre_clé_anon_supabase

# 🧠 Configuration IA n8n (obligatoire)
EXPO_PUBLIC_AI_WEBHOOK_URL=https://votre_domaine_n8n.com/webhook/smart-wardrobe-weather

# 🌤️ Configuration météo (optionnel - URL par défaut utilisée)
WEATHER_API_URL=https://api.open-meteo.com/v1/forecast

# 📸 Configuration Storage Supabase (optionnel)
S3_ENDPOINT=https://votre_projet.storage.supabase.co/storage/v1/s3
S3_REGION=eu-west-1

# 🔄 URL de réinitialisation (développement)
EXPO_PUBLIC_RESET_URL=exp://192.168.1.114:8081/--/reset-password
```

#### 📋 Ce qu'il faut changer pour utiliser l'application :

1. **Supabase** :
   - Créez un projet sur [supabase.com](https://supabase.com)
   - Récupérez l'URL du projet (Settings → API → Project URL)
   - Récupérez la clé `anon/public` (Settings → API → Project API keys → `anon public`)
   - Activez le bucket `clothes_image` dans Storage
   - Implémentez les tables et policies RLS (voir section "Déploiement Supabase")

2. **n8n** :
   - Déployez le workflow `Smart_Wardrobe_ASSISTANT.json` sur votre instance n8n
   - Créez un webhook et copiez son URL
   - Configurez les credentials OpenRouter avec votre clé API

3. **OpenRouter** :
   - Créez un compte sur [openrouter.ai](https://openrouter.ai)
   - Générez une clé API
   - Ajoutez la clé comme credential dans n8n

> ⚠️ **IMPORTANT** : Ne jamais committer le fichier `.env` (il est dans `.gitignore`) car il contient des clés API sensibles.

#### 🚀 Variables pour le développement local :
- `EXPO_PUBLIC_RESET_URL` : URL de redirection pour reset password (à adapter selon votre adresse IP locale)
- Les autres variables doivent pointer vers vos services déployés

### Lancer l’application

```bash
npm start   
# ou 
npx expo start
```

Scannez le QR code avec l’application Expo Go (Android/iOS) ou utilisez un émulateur.

---

## 📁 Structure du projet (principale)

```
Smart-Wardrobe-Assistant/
├── assets/                # images, icônes
├── components/            # composants réutilisables
├── contexts/              # Context API (Auth
├── docs/            # documentations
├── hooks/                 # hooks personnalisés (useWeather, useSuggestion, useDate...)
├── screens/               # écrans (Home, Wardrobe, Profile, Login, Register...)
├── services/              # appels API (weather, supabase, n8n)
├── theme.js               # styles globaux et couleurs
├── App.js                 # point d’entrée
├── .env                   # variables sensibles 
└── README.md
```

---

## 🚀 Déploiement Supabase

### 1. Création du projet
1. Créez un projet sur [supabase.com](https://supabase.com)
2. Notez l'URL du projet et la clé `anon/public`

### 2. Configuration des tables
Exécutez ces requêtes SQL dans l'éditeur SQL de Supabase :

```sql
-- Table des utilisateurs
CREATE TABLE users (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT NOT NULL,
  city TEXT,
  country TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des vêtements
CREATE TABLE clothes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  style TEXT NOT NULL,
  color TEXT NOT NULL,
  isWaterproof BOOLEAN DEFAULT false,
  temperatureMin INTEGER,
  temperatureMax INTEGER,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des suggestions quotidiennes
CREATE TABLE daily_suggestions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  suggestion_date DATE NOT NULL,
  explanation TEXT NOT NULL,
  selected_items_ids UUID[] NOT NULL,
  comfort_score INTEGER NOT NULL,
  filters_occasion TEXT,
  filters_style TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, suggestion_date, filters_occasion, filters_style)
);
```

### 3. Activation des Policies RLS
Activez RLS sur chaque table et ajoutez ces policies :

```sql
-- Policies pour la table 'users'
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Policies pour la table 'clothes'
ALTER TABLE clothes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own clothes"
  ON clothes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own clothes"
  ON clothes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own clothes"
  ON clothes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own clothes"
  ON clothes FOR DELETE
  USING (auth.uid() = user_id);

-- Policies pour la table 'daily_suggestions'
ALTER TABLE daily_suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own suggestions"
  ON daily_suggestions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own suggestions"
  ON daily_suggestions FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

### 4. Configuration du Storage
1. Dans Supabase → Storage → Créez un bucket nommé `clothes_image`
2. Configurez les permissions :
   - `Public` : Activé (pour les URLs publiques des images)
   - Policies : Similaires à la table `clothes` (un utilisateur ne peut uploader/supprimer que ses propres fichiers)

### 5. Déploiement des Edge Functions
Les fonctions edge pour la suppression de compte et réinitialisation mot de passe sont dans `supabase/functions/`. Déployez-les via l'interface Supabase ou la CLI.

---

## 👥 Équipe

- **Conambot NGUESSAN** ([@WilFriite](https://github.com/WilFriite)) – Supabase integration (DB, storage), gestion des vêtements, persistance des données, React Query, bucket configuration.
- **Julie SAINT MARTIN** ([@jstm17](https://github.com/jstm17)) – Services d'authentification (reset password, delete account), météo, UI elements, optimisation des performances.
- **Rémi KORZENIOWSKI** ([@Thekorzeremi](https://github.com/Thekorzeremi)) – UI/UX, navigation, glassmorphism, intégration, theming, composants réutilisables.
- **Seer MENSAH ASSIAKOLEY** ([@MaashRees](https://github.com/MaashRees)) – IA, n8n, filtres, suggestion, logique métier, rafraîchissement automatique, Policies RLS, Supabase backend services, edge functions.

---

## 📄 Licence

Ce projet est réalisé dans un cadre pédagogique.
Licence MIT – libre d’utilisation et de modification.

---

## 🙏 Remerciements

- [Open-Meteo](https://open-meteo.com) pour l’API météo gratuite
- [Supabase](https://supabase.com) pour l’auth et la BDD
- [n8n](https://n8n.io) pour le workflow IA
- [OpenRouter](https://openrouter.ai) pour l’accès aux modèles LLM
- [DiceBear](https://dicebear.com) pour les avatars

---

**Smart Wardrobe Assistant** – Habillez-vous intelligemment, chaque jour. 🧥✨ 