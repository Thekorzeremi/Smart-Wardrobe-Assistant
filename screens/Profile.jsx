import { Text, View , TouchableOpacity, Alert } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { profileStyles } from "../theme";
import { Avatar } from "../components/Avatar";

export const Profile = ({navigation}) => {
  const { user, userData, signOut, updateProfile } = useAuth();
  
  const username = userData?.username || user?.email?.split('@')[0] || "Utilisateur";
  const email = user?.email || "";
  const location = [userData?.city, userData?.country].filter(Boolean).join(', ');

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
    <View style={profileStyles.container}>
      <Avatar seed={username} size={104} />
      <Text style={profileStyles.name}>{username}</Text>
      <Text style={profileStyles.email}>{email}</Text>
      {location ? <Text style={profileStyles.city}>{location}</Text> : null}
      <View style={profileStyles.menu}>
        <TouchableOpacity onPress={() => navigation.navigate("ProfileUpdate")}>
          <Text style={profileStyles.menuItem}>Modifier le profil</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={() => Alert.alert("Notifications", "Fonctionnalité à venir")}>
          <Text style={profileStyles.menuItem}>Notifications</Text>
        </TouchableOpacity> */}
        <TouchableOpacity onPress={handleLogout}>
          <Text style={profileStyles.logout}>Déconnexion</Text>
        </TouchableOpacity>
      </View>
      
    </View>
  );
};
