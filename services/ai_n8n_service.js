import { EXPO_PUBLIC_AI_WEBHOOK_URL } from "@env";

const AI_WEBHOOK_URL = EXPO_PUBLIC_AI_WEBHOOK_URL.replace("-test", "");

function prepareAIPayload(weather, userId, filters = {}) {
  let request =
    "Propose-moi la meilleure tenue pour aujourd'hui. Donne-moi une recommandation de tenue complète (haut, bas, chaussures, accessoires) adaptée à la météo actuelle et à mon style personnel.";
  if (filters.occasion) {
    request += ` L'occasion est : ${filters.occasion}. Adapte la tenue en conséquence.`;
  }
  if (filters.style) {
    request += ` Mon style préféré est : ${filters.style}. Choisis des vêtements qui correspondent à ce style.`;
  }
  request +=
    " Justifie ta recommandation en expliquant pourquoi cette tenue est appropriée pour les conditions météorologiques et comment elle correspond à mon style.";
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
    filters: filters,
    request: request,
  };
}

export async function fetchSuggestion(userId, weatherData, filters = {}) {
  const payload = prepareAIPayload(weatherData, userId, filters);
  console.log("Payload IA :", payload);
  console.log("Envoi de la requête à l'IA...");
  console.log("UserId envoyé:", userId);
  console.log("Payload complet:", JSON.stringify(payload, null, 2));
  const response = await fetch(AI_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  console.log("Réponse de l'IA reçue :", response);
  if (!response.ok) {
    const text = await response.text();
    if (text.includes("No item to return")) {
      throw new Error("No item to return");
    }
    throw new Error("Erreur IA : " + response.status);
  }

  const result = await response.json();
  return result;
}
