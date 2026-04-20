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

- **Variables d’environnement** : toutes les clés (Supabase, webhook n8n) sont stockées dans `.env` et chargées via `react-native-dotenv`. Le fichier `.env` est exclu du versionnement (`.gitignore`).
- **Supabase RLS** : à mettre en place pour garantir l’isolation des données entre utilisateurs. Actuellement, les requêtes filtrées côté client sont fragiles.
- **Authentification** : gestion des sessions via Supabase, mots de passe hashés.
- **Communications** : toutes les API sont en HTTPS.

---

## 8. Améliorations possibles (roadmap technique)

| Piste | Description |
|-------|-------------|
| **Météo multi‑jours** | Étendre `weatherService` pour récupérer les prévisions sur 5‑7 jours et permettre la suggestion pour une date précise. |
| **Upload photos** | Intégrer `expo-image-picker` + stockage dans Supabase bucket `clothes`. |
| **CRUD vêtements** | Écrans d’ajout, modification, suppression avec formulaire et validation. |
| **Suppression compte** | Ajouter un endpoint `deleteUser` qui supprime l’auth Supabase et la ligne `users`. |
| **Mot de passe oublié** | Utiliser `supabase.auth.resetPasswordForEmail()`. |
| **Tests** | Ajouter des tests unitaires (Jest) et end‑to‑end (Detox). |
| **Notifications** | Rappel quotidien pour consulter la suggestion. |

---

## 9. Annexe – Exemple de payload n8n / réponse IA

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

## 10. Références

- [Documentation React Native](https://reactnative.dev)
- [Expo SDK](https://docs.expo.dev)
- [Supabase](https://supabase.com/docs)
- [Open‑Meteo](https://open-meteo.com)
- [n8n](https://docs.n8n.io)
- [OpenRouter](https://openrouter.ai/docs)
