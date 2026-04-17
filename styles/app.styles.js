import { StyleSheet } from "react-native";

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 34,
    fontWeight: "700",
    color: "#f3f5ff",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(243,245,255,0.7)",
    marginBottom: 32,
    textAlign: "center",
  },
  input: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 14,
    padding: 14,
    marginVertical: 8,
    color: "#f3f5ff",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  button: {
    width: "100%",
    backgroundColor: "#788eff",
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  link: {
    color: "#788eff",
    textAlign: "center",
    marginTop: 24,
    fontSize: 16,
  },
});


export const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05070f",
    alignItems: "center",
    paddingTop: 92,
    paddingHorizontal: 20,
    paddingBottom: 110,
  },
  avatar: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  avatarImage: {
    width: 104,
    height: 104,
    borderRadius: 52,
    marginBottom: 18,
  },
  avatarText: {
    color: "#f3f5ff",
    fontSize: 38,
    fontWeight: "700",
  },
  name: {
    color: "#f3f5ff",
    fontSize: 35,
    fontWeight: "700",
  },
  city: {
    color: "rgba(243,245,255,0.72)",
    fontSize: 20,
    marginTop: 4,
  },
  menu: {
    width: "100%",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    backgroundColor: "rgba(132, 137, 255, 0.14)",
    marginTop: 28,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 14,
  },
  menuItem: {
    color: "#f3f5ff",
    fontSize: 20,
    fontWeight: "500",
  },
  logout: {
    color: "#ff5f69",
    fontSize: 20,
    fontWeight: "600",
  },
});
