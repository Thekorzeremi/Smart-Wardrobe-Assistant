import { StyleSheet } from "react-native";

export default function FrostedCard() {
  return <Text style={styles.title}>Liquid Glass UI</Text>;
}

const styles = StyleSheet.create({
  background: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    width: 300,
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  title: { fontSize: 22, fontWeight: "600", color: "#fff" },
  text: { fontSize: 16, color: "#f2f2f2" },
});
