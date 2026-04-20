# Document technique – Smart Wardrobe Assistant

## 1. Introduction

Ce document décrit l’architecture, les choix techniques et le fonctionnement interne de l’application mobile **Smart Wardrobe Assistant**. Il s’adresse aux développeurs souhaitant comprendre, maintenir ou faire évoluer le projet.

---

## 2. Architecture générale

L’application suit une architecture **client‑serveur** avec des services externes :

```
[App mobile (Expo)]  
       │  
       ├──► Supabase (Auth + Base de données)
       │  
       ├──► Open‑Meteo (API météo)
       │  
       └──► n8n (workflow IA) ──► OpenRouter / Gemini
```

- **Frontend** : React Native (Expo) – gestion d’état local, navigation, composants.
- **Backend** : Supabase (authentification, stockage des utilisateurs et vêtements).
- **Météo** : Open‑Meteo – gratuit, sans clé, données actuelles + horaires.
- **IA** : n8n webhook → prompt → modèle Gemini via OpenRouter.

Aucun serveur propriétaire n’est hébergé ; tout repose sur des services serverless et des API.

---

## 3. Services externes détaillés

### 3.1 Supabase

- **Rôle** : authentification (email/mot de passe), stockage des tables `users` et `clothes`.
- **URL** : fournie via `EXPO_PUBLIC_SUPABASE_URL` et `EXPO_PUBLIC_SUPABASE_KEY`.
- **Tables principales** :

| Table | Colonnes principales |
|-------|----------------------|
| `users` | `id` (uuid, clé primaire, liée à `auth.users`), `username`, `city`, `country`, `updated_at` |
| `clothes` | `id` (uuid), `user_id` (uuid), `name`, `type`, `style`, `color`, `isWaterproof` (bool), `temperatureMin`, `temperatureMax`, `image_url` (text) |

- **Politiques RLS** : à implémenter pour garantir qu’un utilisateur ne voit/modifie que ses propres vêtements. (Actuellement, les requêtes utilisent un filtre `user_id` côté front, mais une RLS est recommandée en production.)

### 3.2 Open‑Meteo (météo)

- **Endpoint** : `https://api.open-meteo.com/v1/forecast`
- **Paramètres** :
    - `latitude`, `longitude` (obtenues par géolocalisation)
    - `current_weather=true`
    - `hourly=relativehumidity_2m,apparent_temperature,windgusts_10m,precipitation,uv_index,visibility`
    - `timezone=auto`
- **Traitement** : Le service extrait l’heure courante pour récupérer les valeurs horaires (température ressentie, humidité, précipitations, etc.) et utilise un mapping de codes météo pour fournir une condition lisible et un emoji.

### 3.3 n8n (workflow IA)

- **Fichier de workflow** : `Smart_WARDROBE_ASSISTANT.json`
- **Méthode** : Webhook POST à l’URL `EXPO_PUBLIC_AI_WEBHOOK_URL`.
- **Étapes du workflow** :
    1. Réception des données : `{ weather, user: { id }, filters, request }`
    2. Requête Supabase pour récupérer tous les vêtements de l’utilisateur (`user_id` = id)
    3. Agrégation des vêtements dans un tableau `clothes`
    4. Appel du modèle LLM (OpenRouter / Gemini) avec un prompt système et un prompt utilisateur contenant la météo, les filtres et la liste des vêtements
    5. Le LLM répond en JSON strict avec `explanation`, `selected_items_ids`, `comfort_score`
    6. Parsing de la réponse, split des IDs, puis nouvelle requête Supabase pour obtenir les détails complets des vêtements sélectionnés
    7. Réassemblage final et renvoi au client

### 3.4 OpenRouter / Gemini

- **Modèle utilisé** : `google/gemini-2.0-flash-lite-001`
- **Température** : `0.3` (pour une sortie déterministe mais un peu créative)
- **Format de réponse** : `json_object` forcé
- **Prompt système** : styliste personnel, règles strictes (ne jamais proposer un vêtement absent, retourner uniquement du JSON)
- **Prompt utilisateur** : construit dynamiquement avec météo, filtres et liste des vêtements.

---

## 4. Frontend – React Native / Expo

### 4.1 Structure des dossiers

```
src/ (ou racine)
├── components/       # composants réutilisables (GlassTabBar, WeatherCarousel, etc.)
├── contexts/         # AuthContext (gestion session utilisateur)
├── hooks/            # hooks personnalisés (useWeather, useSuggestion, useDate, useRefreshOnFocus)
├── screens/          # écrans (Home, Wardrobe, Profile, Login, Register, ProfileUpdate)
├── services/         # appels API (supabase, weatherService, ai_n8n_service, userService)
├── theme.js          # styles globaux, couleurs, effets glassmorphism
├── App.js            # point d’entrée, providers (Navigation, QueryClient, Auth)
└── index.js          # registration racine avec GestureHandlerRootView
```

### 4.2 Gestion d’état et requêtes

- **React Query** (`@tanstack/react-query`) : cache et synchronisation des données serveur.
    - `useWeather` : requête météo (staleTime 10 min)
    - `useGetClothesQuery` : liste des vêtements (stale par défaut)
    - `useSuggestion` : suggestion IA (staleTime 30 min, cache 24h, invalidation manuelle via `refresh()`)
- **AsyncStorage** : utilisé par Supabase pour persister la session et par React Query pour le cache persistant (optionnel).

### 4.3 Navigation

- **Stack Navigator** : `AuthStack` (Login, Register) et `AppStack` (Tabs + ProfileUpdate)
- **Bottom Tab Navigator** : personnalisé via `GlassTabBar` (effet glassmorphism, animation au swipe)
- **Écrans** : Accueil, Armoire, Profil

### 4.4 Composants clés

| Composant | Rôle |
|-----------|------|
| `GlassTabBar` | Barre de navigation inférieure avec flou, animation de bulle, détection de swipe |
| `WeatherCarousel` | Affichage météo (2 slides : conditions générales + détails) |
| `SuggestionSection` | Affiche la tenue suggérée, gère les filtres et le rafraîchissement |
| `FilterModal` | Modal permettant de choisir une occasion et un style |
| `WardrobeItem` | Carte d’un vêtement (image, nom) |
| `Avatar` | Génération d’avatar SVG via DiceBear (openPeeps) |

### 4.5 Thème et styles

- Fichier `theme.js` centralise :
    - Couleurs (dégradés, cartes, glassmorphism)
    - Styles communs (`elements`, `authStyles`, `profileStyles`)
    - Effets de flou (`BlurView`), bordures, ombres
    - Animations pour la tab bar (spring, easing)

---

## 5. Flux fonctionnels critiques

### 5.1 Suggestion de tenue (le plus important)

1. **Déclenchement** :
    - À l’ouverture de l’écran `Home`
    - Via le bouton `Refresh` (invalide la requête)
    - Via l’application des filtres
    - Automatiquement chaque jour (détection changement de date via `useFocusEffect` + `getDayKey()`)

2. **Exécution** :
    - `useSuggestion` appelle `fetchWeather()` puis `fetchSuggestion(userId, weather, filters)`
    - `fetchSuggestion` envoie un POST au webhook n8n avec la météo et l’ID utilisateur
    - n8n interroge Supabase, appelle Gemini, reformate la réponse
    - Le client reçoit : `{ explanation, comfort_score, selected_items_ids, clothes[] }`

3. **Affichage** :
    - Texte d’explication
    - Score de confort /10
    - Grille des vêtements (image + nom)

### 5.2 Authentification

- `AuthContext` :
    - `signIn(email, password)` → Supabase Auth
    - `signUp(email, password)` → Supabase Auth + création d’un enregistrement dans `users` via `userService.upsertUser`
    - `signOut()` → déconnexion Supabase + nettoyage état local
    - `updateProfile(updates)` → met à jour la table `users`
- Persistance de session automatique via `AsyncStorage`.

### 5.3 Météo

- `useWeather` :
    - Obtient la localisation via `expo-location` (permission, reverse geocoding)
    - Appelle Open‑Meteo avec les coordonnées
    - Transforme la réponse (température, ressenti, précipitations, etc.)
    - Met en cache 10 minutes.

---

## 6. Modèle de données – Vêtement (conformément au cahier des charges)

```json
{
  "id": "uuid",
  "user_id": "uuid",
  "name": "Veste noire",
  "type": "jacket",
  "style": "casual",
  "color": "black",
  "isWaterproof": true,
  "temperatureMin": 5,
  "temperatureMax": 15,
  "image_url": "https://..."
}
```

Les champs `type`, `style`, `color`, `isWaterproof`, `temperatureMin/Max` sont utilisés dans le prompt IA pour affiner la suggestion (bien que l’IA reçoive la liste complète, ces attributs peuvent être mentionnés dans la description).

---

## 7. Sécurité

### 7.1 Variables d’environnement
- Toutes les clés API sensibles sont stockées dans le fichier `.env` à la racine du projet
- Chargement via `react-native-dotenv` avec préfixe `EXPO_PUBLIC_` pour les variables accessibles côté client
- Le fichier `.env` est exclu du versionnement (`.gitignore`) pour éviter l’exposition des credentials

### 7.2 Row Level Security (RLS) Supabase
**Implémenté sur toutes les tables :**

#### Table `users`
```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON users FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT WITH CHECK (auth.uid() = id);
```

#### Table `clothes`
```sql
ALTER TABLE clothes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own clothes"
  ON clothes FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own clothes"
  ON clothes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own clothes"
  ON clothes FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own clothes"
  ON clothes FOR DELETE USING (auth.uid() = user_id);
```

#### Table `daily_suggestions`
```sql
ALTER TABLE daily_suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own suggestions"
  ON daily_suggestions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own suggestions"
  ON daily_suggestions FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### 7.3 Edge Functions Supabase
Deux fonctions edge sont déployées pour les opérations sensibles :

1. **`delete-user`** : Suppression complète du compte utilisateur
   - Supprime l’entrée dans `auth.users`
   - Supprime les données associées dans `users`, `clothes`, `daily_suggestions`
   - Nettoie les fichiers du bucket `clothes_image`

2. **`reset-password`** : Réinitialisation sécurisée du mot de passe
   - Validation du token JWT
   - Appel à `supabase.auth.resetPasswordForEmail()`
   - Gestion des erreurs et logs

### 7.4 Storage Supabase
- Bucket `clothes_image` configuré avec permissions `Public` pour les URLs directes
- Policies RLS similaires aux tables pour contrôle d’accès
- Les images sont uploadées via `storage-service.js` avec nommage unique

### 7.5 Authentification et sessions
- Hashage des mots de passe via Supabase Auth
- Sessions persistées dans `AsyncStorage` avec expiration configurée
- Tokens JWT avec expiration limitée
- Communications HTTPS pour toutes les API externes

### 7.6 Validation des inputs
- Validation côté client des formulaires (login, register, création vêtement)
- Sanitization des entrées utilisateur avant envoi aux services externes
- Rate limiting côté n8n pour prévenir les abus sur l’API IA

---

## 8. État du projet et roadmap technique

### 8.1 ✅ Fonctionnalités implémentées

| Fonctionnalité | Statut | Détails |
|---------------|--------|---------|
| **Authentification complète** | ✅ Production | Login, register, reset password, delete account, edge functions |
| **Météo temps réel** | ✅ Production | Open-Meteo API, géolocalisation, reverse geocoding |
| **Suggestion IA quotidienne** | ✅ Production | Workflow n8n + Gemini 2.0, persistance DB, rafraîchissement auto |
| **CRUD vêtements complet** | ✅ Production | Upload photos Supabase Storage, édition, suppression, validation |
| **Interface moderne** | ✅ Production | Glassmorphism, animations, navigation personnalisée |
| **Sécurité RLS** | ✅ Production | Policies sur toutes les tables + bucket storage |
| **Cache intelligent** | ✅ Production | React Query + DB caching + refresh automatique |

### 8.2 🔄 En cours de développement

| Fonctionnalité | Priorité | Détails / Progression |
|---------------|----------|----------------------|
| **Suggestion multi‑jours** | HAUTE | Prévisions météo 5 jours + sélection date calendrier |
| **Notifications push** | MOYENNE | Rappels quotidiens, Expo Notifications |
| **Tests automatisés** | MOYENNE | Jest (unitaires) + Detox (E2E) |
| **Mode hors-ligne amélioré** | BASSE | Cache intelligent, synchro automatique |

### 8.3 📅 Améliorations futures

| Amélioration | Description | Estimation |
|--------------|-------------|------------|
| **Analytics utilisateur** | Tracking anonymisé des suggestions, filtres utilisés | 2-3 jours |
| **Partage de tenues** | Partage social des suggestions (réseaux sociaux) | 3-4 jours |
| **Intégration calendrier** | Synchronisation avec Google Calendar/Apple Calendar | 4-5 jours |
| **Recommandations achats** | Suggestions d’achats basées sur trous dans la garde-robe | 5-7 jours |
| **Thèmes personnalisables** | Light/dark mode, couleurs personnalisables | 3-4 jours |

### 8.4 🐛 Correctifs et optimisations

| Problème | Solution proposée | Priorité |
|----------|-------------------|----------|
| **Validation formulaires** | Ajouter validation robuste + messages d’erreur UX | HAUTE |
| **Gestion erreurs IA** | Meilleur fallback quand n8n/AI retourne erreur | MOYENNE |
| **Performance images** | Lazy loading + cache local images | MOYENNE |
| **Bundle size** | Tree-shaking, code splitting, optimisation assets | BASSE |

---

## 9. Guide de déploiement rapide

### 9.1 Prérequis techniques
- Node.js 18+ et npm/yarn
- Compte Supabase (gratuit tier)
- Instance n8n (cloud ou self-hosted)
- Compte OpenRouter (pour clé API Gemini)

### 9.2 Variables d'environnement critiques
```env
# ⚠️ Obligatoires
EXPO_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=votre_anon_public_key
EXPO_PUBLIC_AI_WEBHOOK_URL=https://votre-n8n.com/webhook/smart-wardrobe-weather

# 🌤️ Optionnel (URL par défaut utilisée)
WEATHER_API_URL=https://api.open-meteo.com/v1/forecast

# 📸 Configuration Storage (optionnel)
S3_ENDPOINT=https://votre-projet.storage.supabase.co/storage/v1/s3
S3_REGION=eu-west-1

# 🔧 Développement local
EXPO_PUBLIC_RESET_URL=exp://votre-ip:8081/--/reset-password
```

### 9.3 Déploiement Supabase étape par étape
1. **Créer projet** : Dashboard Supabase → New Project
2. **Configurer tables** : Exécuter les requêtes SQL de la section 7
3. **Activer RLS** : Ajouter les policies comme documenté
4. **Créer bucket** : Storage → New bucket → `clothes_image` (public)
5. **Déployer edge functions** : CLI Supabase ou interface web

### 9.4 Déploiement n8n
1. **Importer workflow** : `workflow_n8n/Smart_Wardrobe_ASSISTANT.json`
2. **Configurer credentials** : 
   - OpenRouter API key
   - Supabase credentials (pour requêter la BDD)
3. **Créer webhook** : Copier l'URL générée
4. **Tester le workflow** : Simuler une requête avec des données de test

### 9.5 Test de l'application
```bash
# Installation
npm install

# Configuration
cp .env.example .env  # Remplir avec vos valeurs

# Lancement
npm start  # ou npx expo start

# Tester sur:
# - Expo Go (scan QR code)
# - iOS Simulator (macOS)
# - Android Emulator
# - Web (expo start --web)
```

### 9.6 Monitoring en production
- **Supabase** : Dashboard → Logs, Database Health, Query Performance
- **n8n** : Execution history, error logs, webhook statistics
- **Application** : Console Expo, crash reports

---

## 10. Annexe – Exemple de payload n8n / réponse IA

**Payload envoyé au webhook :**
```json
{
  "weather": {
    "temperature": 15,
    "feelsLike": 12,
    "condition": "Pluie modérée",
    "emoji": "🌧",
    "windspeed": 20,
    "precipitation": 2.5,
    "humidity": 85
  },
  "user": { "id": "uuid" },
  "filters": { "occasion": "work", "style": "elegant" },
  "request": "Propose-moi la meilleure tenue..."
}
```

**Réponse de n8n (après reformatage) :**
```json
{
  "explanation": "Pour une journée pluvieuse à 12°C ressentis, je recommande un imperméable noir, un pull en laine gris, un pantalon habillé et des bottines imperméables.",
  "comfort_score": 9,
  "selected_items_ids": ["id1", "id2", "id3", "id4"],
  "clothes": [ { "id": "id1", "name": "Imperméable", ... }, ... ]
}
```

---

## 11. Références techniques

### Documentation officielle
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Expo SDK Documentation](https://docs.expo.dev)
- [Supabase Documentation](https://supabase.com/docs)
- [React Navigation](https://reactnavigation.org/docs/getting-started)
- [React Query (TanStack)](https://tanstack.com/query/latest/docs/framework/react/overview)

### Services externes
- [Open‑Meteo API](https://open-meteo.com) – API météo gratuite
- [n8n Documentation](https://docs.n8n.io) – Workflow automation
- [OpenRouter API](https://openrouter.ai/docs) – Modèles LLM
- [DiceBear Avatars](https://dicebear.com) – Génération avatars SVG

### Outils de développement
- [Expo Go](https://expo.dev/go) – Application de test
- [Supabase CLI](https://supabase.com/docs/guides/cli) – Déploiement local
- [n8n Desktop](https://docs.n8n.io/hosting/installation/desktop/) – Version desktop

### Ressources pédagogiques
- [React Native en français](https://www.reactnative.guide)
- [Supabase en français](https://supabase.fr)
- [Expo en français](https://docs.expo.dev/fr)

---

## 12. Licence et contribution

### Licence
Ce projet est sous licence MIT – libre d'utilisation, modification et distribution.

### Contribution
Les contributions sont les bienvenues ! Pour contribuer :
1. Fork le repository
2. Créer une branche feature (`git checkout -b feature/amazing-feature`)
3. Commiter les changements (`git commit -m 'Add amazing feature'`)
4. Pousser vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

### Code de conduite
Respectez les autres contributeurs et maintenez une atmosphère collaborative et inclusive.
