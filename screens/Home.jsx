import { ScrollView, StyleSheet, Text, View } from "react-native";

export const Home = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.hello}>Bonjour, Remi</Text>
      <Text style={styles.title}>Accueil Smart Wardrobe</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Suggestion du jour</Text>
        <Text style={styles.cardText}>
          Il fait doux aujourd'hui. Pense a une tenue legere avec une veste fine.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Prochaine etape</Text>
        <Text style={styles.cardText}>
          Va dans l'onglet Armoire pour afficher ta garde-robe, ou Profil pour modifier
          ton compte.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#05070f",
    paddingHorizontal: 20,
    paddingTop: 76,
    paddingBottom: 110,
    gap: 14,
  },
  hello: {
    color: "#b4c0ff",
    fontSize: 15,
  },
  title: {
    color: "#f3f5ff",
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 12,
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
