import { ScrollView, StyleSheet, Text, View } from "react-native";

const ITEMS = [
  "Veste noire",
  "T-shirt blanc",
  "Jean bleu",
  "Sweat gris",
  "Pantalon beige",
  "Chemise bleue",
];

export const Wardrobe = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Mon Armoire</Text>
      <View style={styles.grid}>
        {ITEMS.map((item) => (
          <View key={item} style={styles.itemCard}>
            <View style={styles.imagePlaceholder} />
            <Text style={styles.itemTitle}>{item}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#05070f",
    paddingHorizontal: 16,
    paddingTop: 76,
    paddingBottom: 110,
  },
  title: {
    color: "#f3f5ff",
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  itemCard: {
    width: "48%",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    backgroundColor: "rgba(255,255,255,0.08)",
    padding: 10,
  },
  imagePlaceholder: {
    height: 100,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.13)",
    marginBottom: 10,
  },
  itemTitle: {
    color: "#eef1ff",
    fontSize: 15,
    fontWeight: "500",
  },
});
