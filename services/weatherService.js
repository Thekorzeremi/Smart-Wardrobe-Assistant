import * as Location from "expo-location";

const API_BASE = "https://api.open-meteo.com/v1/forecast";
const DEFAULT_COORDS = { latitude: 48.8566, longitude: 2.3522 };
const DEFAULT_LOCATION = { city: "Paris", country: "France" };

const WEATHER_CODES = {
  0: { condition: "Clair", emoji: "☀️" },
  1: { condition: "Principalement ensoleillé", emoji: "🌤" },
  2: { condition: "Partiellement nuageux", emoji: "⛅️" },
  3: { condition: "Nuageux", emoji: "☁️" },
  45: { condition: "Brouillard", emoji: "🌫" },
  48: { condition: "Brouillard givrant", emoji: "🌫❄️" },
  51: { condition: "Bruine", emoji: "🌧" },
  53: { condition: "Bruine modérée", emoji: "🌦" },
  55: { condition: "Bruine dense", emoji: "🌧" },
  61: { condition: "Pluie faible", emoji: "🌦" },
  63: { condition: "Pluie modérée", emoji: "🌧" },
  65: { condition: "Pluie forte", emoji: "⛈" },
  71: { condition: "Neige faible", emoji: "❄️" },
  73: { condition: "Neige modérée", emoji: "❄️" },
  75: { condition: "Neige forte", emoji: "❄️" },
  80: { condition: "Averses faibles", emoji: "🌦" },
  81: { condition: "Averses modérées", emoji: "🌧" },
  82: { condition: "Averses fortes", emoji: "⛈" },
};

const getWeatherInfo = (weathercode) => {
  return WEATHER_CODES[weathercode] ?? { condition: "Inconnu", emoji: "🌥" };
};

const getHourlyIndex = (hourly, currentTime) => {
  if (!hourly?.time) return -1;

  const exactIndex = hourly.time.indexOf(currentTime);
  if (exactIndex >= 0) return exactIndex;

  const currentHour = currentTime.slice(0, 13);
  const sameHourIndex = hourly.time.findIndex((time) =>
    time.startsWith(currentHour),
  );
  if (sameHourIndex >= 0) return sameHourIndex;

  return hourly.time.length > 0 ? hourly.time.length - 1 : -1;
};

const getHourlyValue = (hourly, currentTime, field) => {
  if (!hourly?.time || !hourly?.[field]) return null;
  const index = getHourlyIndex(hourly, currentTime);
  return index >= 0 ? hourly[field][index] : null;
};

const getLocationAsync = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return { coords: DEFAULT_COORDS, place: DEFAULT_LOCATION };
    }

    const location = await Location.getCurrentPositionAsync({});
    const reverseGeocode = await Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

    const place = reverseGeocode[0] || {};
    return {
      coords: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
      place: {
        city: place.city || place.region || DEFAULT_LOCATION.city,
        country: place.country || DEFAULT_LOCATION.country,
      },
    };
  } catch (error) {
    return { coords: DEFAULT_COORDS, place: DEFAULT_LOCATION };
  }
};

const formatWeatherResponse = (data, location) => {
  const current = data.current_weather;
  const weatherInfo = getWeatherInfo(current.weathercode);

  return {
    temperature: Math.trunc(current.temperature),
    feelsLike:
      getHourlyValue(data.hourly, current.time, "apparent_temperature") ?? 0,
    windspeed: current.windspeed,
    windgusts: getHourlyValue(data.hourly, current.time, "windgusts_10m") ?? 0,
    humidity:
      getHourlyValue(data.hourly, current.time, "relativehumidity_2m") ?? 0,
    precipitation:
      getHourlyValue(data.hourly, current.time, "precipitation") ?? 0,
    uvIndex: getHourlyValue(data.hourly, current.time, "uv_index") ?? 0,
    visibility: getHourlyValue(data.hourly, current.time, "visibility") ?? 0,
    isDay: current.is_day,
    weathercode: current.weathercode,
    condition: weatherInfo.condition,
    emoji: weatherInfo.emoji,
    city: location.place.city,
    country: location.place.country,
    latitude: data.latitude,
    longitude: data.longitude,
  };
};

export const fetchWeather = async () => {
  const location = await getLocationAsync();
  const url = `${API_BASE}
?latitude=${location.coords.latitude}
&longitude=${location.coords.longitude}
&current=temperature_2m,weathercode,is_day,windspeed_10m
&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,windgusts_10m,precipitation,uv_index,visibility
&timezone=auto`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Impossible de récupérer la météo");
  }

  const data = await response.json();
  return formatWeatherResponse(data, location);
};
