import { StyleSheet, Text, View , TouchableOpacity, Alert} from "react-native";
import { useAuth } from "../contexts/AuthContext";
export const Profile = ({route}) => {
  const { user, signOut } = useAuth();
  
  const fullName = user?.email?.split('@')[0] || "Utilisateur";
  const email = user?.email || "";
  const firstLetter = fullName.charAt(0).toUpperCase();

  const handleLogout = () => {
    Alert.alert("Déconnexion", "Voulez-vous vraiment vous déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      { text: "OK", onPress: async () => {
        try {
            await signOut();
          } catch (error) {
            Alert.alert("Erreur", error.message);
          }
      } },
    ]);
  };
  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{firstLetter}</Text>
      </View>
      <Text style={styles.name}>{fullName}</Text>
      <Text style={styles.email}>{email}</Text>
      <Text style={styles.city}>Berlin, Germany</Text>
      <View style={styles.menu}>
        {/* <TouchableOpacity onPress={() => route.navigate("ProfileUpdate")}>
          <Text style={styles.menuItem}>Modifier le profil</Text>
        </TouchableOpacity> */}
        {/* <TouchableOpacity onPress={() => Alert.alert("Notifications", "Fonctionnalité à venir")}>
          <Text style={styles.menuItem}>Notifications</Text>
        </TouchableOpacity> */}
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logout}>Déconnexion</Text>
        </TouchableOpacity>
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
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
