import {
  CloudRain,
  Droplet,
  Eye,
  Sun,
  Thermometer,
  Wind,
} from "lucide-react-native";
import { useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { useWeather } from "../hooks/useWeather";
import { Loading } from "../screens/Loading";

const { width } = Dimensions.get("window");

// Slide 1
const MainSlide = ({ temperature, condition, emoji }) => (
  <View style={styles.slide}>
    <Text style={styles.emoji}>{emoji}</Text>
    <View style={{ alignItems: "center" }}>
      <Text style={styles.temp}>{temperature}°</Text>
      <Text style={styles.condition}>{condition}</Text>
    </View>
  </View>
);

// Slide 2
const DetailsSlide = ({ details }) => (
  <View style={[styles.slide, { justifyContent: "space-between" }]}>
    {details.map(({ Icon, value, label }) => (
      <View key={label} style={styles.detailsContainer}>
        <Icon
          color="white"
          size={24}
          strokeWidth={1.5}
          style={styles.detailIcon}
        />
        <Text style={styles.detail}>{value}</Text>
        <Text style={styles.detailTitle}>{label}</Text>
      </View>
    ))}
  </View>
);

// Pagination
const Pagination = ({ count, activeIndex }) => (
  <View style={styles.pagination}>
    {Array.from({ length: count }).map((_, i) => (
      <View
        key={i}
        style={[
          styles.dot,
          i === activeIndex ? styles.dotActive : styles.dotInactive,
        ]}
      />
    ))}
  </View>
);

export const WeatherCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { data, isLoading, isError } = useWeather();

  if (isLoading) return <Loading />;

  if (isError)
    return (
      <View style={styles.slide}>
        <Text style={styles.condition}>Impossible de charger la météo</Text>
      </View>
    );

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

  const details = [
    { Icon: Thermometer, value: `${feelsLike ?? "--"}°`, label: "Ressenti" },
    { Icon: Wind, value: `${windspeed ?? "--"} km/h`, label: "Vent" },
    {
      Icon: Eye,
      value: visibility != null ? `${(visibility / 1000).toFixed(1)} km` : "--",
      label: "Visibilité",
    },
    { Icon: Droplet, value: `${humidity ?? "--"}%`, label: "Humidité" },
    {
      Icon: CloudRain,
      value: `${precipitation ?? "--"} mm`,
      label: "Précipitations",
    },
    { Icon: Sun, value: `${uvIndex ?? "--"}`, label: "Indice UV" },
  ];

  const slides = [
    <MainSlide
      key="main"
      temperature={temperature}
      condition={condition}
      emoji={emoji}
    />,
    <DetailsSlide key="details" details={details} />,
  ];

  const handleScroll = (e) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

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

      <Pagination count={slides.length} activeIndex={activeIndex} />
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
    height: 180,
    flexWrap: "wrap",
  },
  city: { fontSize: 20, lineHeight: 20, fontWeight: "bold", color: "white" },
  temp: { fontSize: 80, lineHeight: 80, fontWeight: "bold", color: "white" },
  emoji: { fontSize: 140, lineHeight: 140 },
  condition: { fontSize: 16, color: "#ddd" },
  detailsContainer: {
    alignItems: "center",
    width: "30%",
  },
  detailTitle: {
    opacity: 0.5,
    color: "white",
  },
  detail: { fontSize: 16, color: "#fff", fontWeight: "500" },
  detailIcon: { marginBottom: 6 },
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
