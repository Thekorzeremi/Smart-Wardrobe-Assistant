import { CloudRain, Droplet, Eye, Sun, Thermometer, Wind } from "lucide-react-native";
import { useState } from "react";
import { Dimensions, ScrollView, Text, View } from "react-native";
import { useWeather } from "../hooks/useWeather";
import { Loading } from "../screens/Loading";
import { elements, weatherDetailsSlideStyle, weatherSlideStyle } from "../theme";

const { width } = Dimensions.get("window");

// Slide 1
const MainSlide = ({ temperature, condition, emoji }) => (
  <View style={[elements.weatherSlide, weatherSlideStyle(width)]}>
    <Text style={elements.weatherEmoji}>{emoji}</Text>
    <View style={elements.weatherMainCenter}>
      <Text style={elements.weatherTemp}>{temperature}°</Text>
      <Text style={elements.weatherCondition}>{condition}</Text>
    </View>
  </View>
);

// Slide 2
const DetailsSlide = ({ details }) => (
  <View style={[elements.weatherSlide, weatherDetailsSlideStyle(width)]}>
    {details.map(({ Icon, value, label }) => (
      <View key={label} style={elements.weatherDetailsContainer}>
        <Icon
          color="white"
          size={24}
          strokeWidth={1.5}
          style={elements.weatherDetailIcon}
        />
        <Text style={elements.weatherDetail}>{value}</Text>
        <Text style={elements.weatherDetailTitle}>{label}</Text>
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
          i === activeIndex ? elements.weatherDotActive : elements.weatherDotInactive,
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
        <Text style={elements.weatherCondition}>Impossible de charger la météo</Text>
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
          <View key={slide.key} style={weatherSlideStyle(width)}>
            {slide}
          </View>
        ))}
      </ScrollView>

      <Pagination count={slides.length} activeIndex={activeIndex} />
    </View>
  );
};
