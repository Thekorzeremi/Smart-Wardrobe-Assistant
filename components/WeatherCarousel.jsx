import { CloudRain, Droplet, Eye, Sun, Thermometer, Wind } from "lucide-react-native";
import { useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { useWeather } from "../hooks/useWeather";
import { Loading } from "../screens/Loading";
import { colors, elements, weatherSlideStyle } from "../theme";

const { width } = Dimensions.get("window");

// Slide 1
const MainSlide = ({ temperature, condition, emoji }) => (
  <View style={styles.slide}>
    <Text style={styles.emoji}>{emoji}</Text>
    <View style={{ alignItems: "center" }}>
      <Text style={styles.temp}>{temperature}°</Text>
      <Text style={[elements.textMedium, { opacity: 0.8 }]}>{condition}</Text>
    </View>
  </View>
);

// Slide 2
const DetailsSlide = ({ details }) => (
  <View
    style={[
      styles.slide,
      { justifyContent: "space-between", alignItems: "center" },
    ]}
  >
    {details.map(({ Icon, value, label }) => (
      <View key={label} style={elements.weatherDetailsContainer}>
        <Icon
          color="white"
          size={24}
          strokeWidth={1.5}
          style={elements.weatherDetailIcon}
        />
        <Text style={elements.textMedium}>{value}</Text>
        <Text style={[elements.textSmall, { opacity: 0.5 }]}>{label}</Text>
      </View>
    ))}
  </View>
);

// Pagination
const Pagination = ({ count, activeIndex }) => (
  <View style={elements.weatherPagination}>
    {Array.from({ length: count }).map((_, i) => (
      <View
        key={i}
        style={[
          elements.weatherDot,
          i === activeIndex
            ? elements.weatherDotActive
            : elements.weatherDotInactive,
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
      <View style={[elements.weatherSlide, weatherSlideStyle(width)]}>
        <Text style={elements.weatherCondition}>
          Impossible de charger la météo
        </Text>
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
    <View style={{ marginVertical: 8, backgroundColor: "transparent" }}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        snapToAlignment="center"
        style={styles.carousel}
      >
        {slides.map((slide) => (
          <View key={slide.key} style={weatherSlideStyle(width)}>
            {slide}
          </View>
        ))}
      </ScrollView>

      <Pagination count={slides.length} activeIndex={activeIndex} />
    </View>
  );
};

const styles = StyleSheet.create({
  carousel: {
    backgroundColor: colors.cardHome.backgroundColor,
    borderColor: colors.cardHome.borderColor,
    borderWidth: 1,
    borderRadius: 20,
  },
  emoji: { fontSize: 120, lineHeight: 140, marginTop: 10 },
  slide: {
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    borderRadius: 20,
    padding: 16,
    gap: 12,
    width: width - 32,
    height: 180,
    flexWrap: "wrap",
  },
  city: { fontSize: 20, lineHeight: 20, fontWeight: "bold", color: "white" },
  temp: { fontSize: 80, lineHeight: 80, fontWeight: "bold", color: "white" },
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
