import { useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { useWeather } from "../hooks/useWeather";
import { Loading } from "../screens/Loading";

const { width } = Dimensions.get("window");

export const WeatherCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const { data, isLoading, isError } = useWeather();

  const {
    temperature,
    windspeed,
    humidity,
    weathercode,
    condition,
    emoji,
    latitude,
    longitude,
    feelsLike,
    windgusts,
    precipitation,
    uvIndex,
    visibility,
  } = data ?? {};

  if (isLoading) return <Loading />;

  const handleScroll = (e) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  const slides = [
    <View style={styles.slide} key="main">
      <Text style={styles.emoji}>{emoji}</Text>
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Text style={styles.temp}>{temperature}°</Text>
        <Text style={styles.condition}>{condition}</Text>
      </View>
    </View>,

    <View style={styles.slide} key="details">
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Text style={styles.detail}>🌡 Ressenti : {feelsLike ?? "--"}°C</Text>
        <Text style={styles.detail}>
          💨 Vent : {windspeed ?? "--"} km/h — rafales {windgusts ?? "--"} km/h
        </Text>
        <Text style={styles.detail}>💧 Humidité : {humidity ?? "--"}%</Text>
        <Text style={styles.detail}>
          🌧 Précipitations : {precipitation ?? "--"} mm
        </Text>
        <Text style={styles.detail}>☀️ Indice UV : {uvIndex ?? "--"}</Text>
        <Text style={styles.detail}>
          👁 Visibilité :{" "}
          {visibility != null ? (visibility / 1000).toFixed(1) : "--"} km
        </Text>
      </View>
    </View>,
  ];

  return (
    <View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        snapToAlignment="center"
      >
        {slides.map((slide) => (
          <View key={slide.key} style={{ width: width - 32 }}>
            {slide}
          </View>
        ))}
      </ScrollView>

      {/* Pagination */}
      <View style={styles.pagination}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              activeIndex === i ? styles.dotActive : styles.dotInactive,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  slide: {
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    borderRadius: 20,
    padding: 16,
    gap: 8,
    width: width - 32,
    height: 160,
  },
  city: { fontSize: 20, lineHeight: 20, fontWeight: "bold", color: "white" },
  temp: { fontSize: 80, lineHeight: 80, fontWeight: "bold", color: "white" },
  emoji: { fontSize: 140, lineHeight: 140 },
  condition: { fontSize: 16, color: "#ddd" },
  detailTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  detail: { fontSize: 16, color: "#ddd" },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginTop: 8,
  },
  dot: { height: 6, borderRadius: 3 },
  dotActive: { width: 16, backgroundColor: "white" },
  dotInactive: { width: 6, backgroundColor: "rgba(255,255,255,0.4)" },
});
