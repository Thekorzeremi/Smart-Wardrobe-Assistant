
import { EXPO_PUBLIC_AI_WEBHOOK_URL } from '@env';

const AI_WEBHOOK_URL = EXPO_PUBLIC_AI_WEBHOOK_URL;

function prepareAIPayload(weather, userId) {
  return {
    weather: {
      temperature: weather.temperature,
      feelsLike: weather.feelsLike,
      condition: weather.condition,
      emoji: weather.emoji,
      windspeed: weather.windspeed,
      precipitation: weather.precipitation,
      humidity: weather.humidity,
    },
    user: {
      id: userId,
    },
    request : "Propose-moi la meilleure tenue pour aujourd'hui. Donne-moi une recommandation de tenue complète (haut, bas, chaussures, accessoires) adaptée à la météo actuelle et à mon style personnel. Justifie ta recommandation en expliquant pourquoi cette tenue est appropriée pour les conditions météorologiques et comment elle correspond à mon style."
  };
}

export async function fetchSuggestion(userId, weatherData) {
  const payload = prepareAIPayload(weatherData, userId);
  console.log("Payload IA :", payload);
  console.log("Envoi de la requête à l'IA...");
  const response = await fetch(AI_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  console.log("Réponse de l'IA reçue :", response);
  if (!response.ok) {
    throw new Error('Erreur IA : ' + response.status);
  }

  const result = await response.json();
  return result;
}