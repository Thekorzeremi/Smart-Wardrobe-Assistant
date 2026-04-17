import { StyleSheet, View } from "react-native";

export default function FrostedCard({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
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
