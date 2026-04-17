import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { HomeHeader } from "../components/HomeHeader";
import { WardrobeItem } from "../components/WardrobeItem";
import { WeatherCarousel } from "../components/WeatherCarousel";
import { useGetClothesQuery } from "../services/wardrobe-service";
import { colors, elements } from "../theme";

export const Home = () => {
  const { data, isLoading, error, refetch } = useGetClothesQuery();

  return (
    <LinearGradient
      colors={[colors.backgroundHomeLinearFrom, colors.backgroundHomeLinearTo]}
      start={{ x: 0, y: 0.1 }}
      style={elements.homeBackground}
    >
      <ScrollView contentContainerStyle={elements.homeContainer}>
        <HomeHeader />
        <WeatherCarousel />

        <View>
          <Text style={[elements.textMedium, { marginBottom: 8 }]}>
            Suggestion du jour
          </Text>
          <Text style={elements.textSmall}>
            Il fait doux aujourd'hui. Pense a une tenue legere avec une veste
            fine.
          </Text>
        </View>
        <View style={styles.grid}>
          {data?.map((item) => (
            <View key={item.id} style={styles.gridItem}>
              <WardrobeItem item={item} variant="home" />
            </View>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 76,
    paddingBottom: 110,
    gap: 8,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 8,
  },
  gridItem: {
    width: "48%",
  },
});
