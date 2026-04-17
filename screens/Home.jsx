import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { HomeHeader } from "../components/HomeHeader";
import { WeatherCarousel } from "../components/WeatherCarousel";

export const Home = () => {
  return (
    <LinearGradient
      colors={["rgba(0, 45, 101, 0.8)", "rgba(0, 9, 20, 0.8)"]}
      start={{ x: 0, y: 0.1 }}
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <HomeHeader />
        <WeatherCarousel />

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Suggestion du jour</Text>
          <Text style={styles.cardText}>
            Il fait doux aujourd'hui. Pense a une tenue legere avec une veste
            fine.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Prochaine etape</Text>
          <Text style={styles.cardText}>
            Va dans l'onglet Armoire pour afficher ta garde-robe, ou Profil pour
            modifier ton compte.
          </Text>
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
    gap: 14,
  },
  card: {
    backgroundColor: "rgba(120, 142, 255, 0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    borderRadius: 20,
    padding: 16,
    gap: 8,
  },
  cardTitle: {
    color: "#eef1ff",
    fontSize: 18,
    fontWeight: "600",
  },
  cardText: {
    color: "rgba(238,241,255,0.88)",
    fontSize: 15,
    lineHeight: 22,
  },
});
