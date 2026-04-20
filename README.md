 
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
| Profil utilisateur (avatar, nom, localisation) | ✅ |
| Modification des infos profil | ✅ |
| Suppression de compte | ✅ |
| Mot de passe oublié | ✅ |
| Déconnexion | ✅ |

### ⏳ Fonctionnalités à venir

| Fonctionnalité | Statut |
|----------------|--------|
| Ajout / modification / suppression d’un vêtement | 🚧 en cours |
| Détail d’un vêtement | 🚧 en cours |
| Suggestion pour une journée précise (météo sur plusieurs jours) | ❌ |
| Photo réelle des vêtements (appareil photo + stockage Supabase) | ❌ |

---

## 🧱 Stack technique

- **Frontend** : React Native (Expo) + React Navigation + React Query
- **Backend & Auth** : Supabase (authentification, base de données)
- **Météo** : Open-Meteo (gratuit, sans clé)
- **IA** : n8n (workflow) + OpenRouter (Gemini 2.0 Flash Lite)
- **Stockage local** : AsyncStorage (session, cache)
- **Icônes & UI** : Lucide React Native, Expo Blur, Linear Gradient

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

Créez un fichier `.env` à la racine :

```env
EXPO_PUBLIC_SUPABASE_URL=votre_url_supabase
EXPO_PUBLIC_SUPABASE_KEY=votre_anon_key_supabase
EXPO_PUBLIC_AI_WEBHOOK_URL=https://votre_webhook_n8n.com/webhook/smart-wardrobe-weather
WEATHER_API_URL=https://api.open-meteo.com/v1/forecast
```

> ⚠️ Ne jamais committer le fichier `.env` (il est dans `.gitignore`).

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

## 👥 Équipe

- **Thekorzeremi** – UI/UX, navigation, glassmorphism, intégration
- **Seer H.** – IA, n8n, filtres, suggestion, logique métier, rafraîchissement automatique, Policies RLS
- **Julie** – Météo, géolocalisation, services externes
- **WilFriite** – Supabase, gestion des vêtements, React Query

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