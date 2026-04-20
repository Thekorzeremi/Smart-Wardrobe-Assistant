import { EXPO_PUBLIC_RESET_URL } from "@env";
import { KeyRoundIcon, LogOutIcon, PencilIcon, Trash } from "lucide-react-native";
import { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { Avatar } from "../components/Avatar";
import { useAuth } from "../contexts/AuthContext";
import { useDeleteAccount } from "../hooks/useDeleteAccount";
import { supabase } from "../services/supabase";
import { profileStyles } from "../theme";

export const Profile = ({ navigation }) => {
  const { user, userData, signOut, updateProfile } = useAuth();
  const [error, setError] = useState("");
  const { deleteAccount } = useDeleteAccount();

  const username = userData?.username || user?.email?.split("@")[0] || "Utilisateur";
  const email = user?.email || "";
  const location = [userData?.city, userData?.country].filter(Boolean).join(", ");

  const handleChangePassword = async () => {
    const resetUrl = __DEV__ ? EXPO_PUBLIC_RESET_URL : "SmartWardrobe://reset-password";

    console.log(resetUrl);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: resetUrl,
    });
    if (error) {
      Alert.alert("Erreur", error.message);
    } else {
      Alert.alert(
        "Email envoyé",
        "Vérifie ta boîte mail pour réinitialiser ton mot de passe.",
      );
    }
  };

  const handleLogout = () => {
    Alert.alert("Déconnexion", "Voulez-vous vraiment vous déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "OK",
        onPress: async () => {
          try {
            await signOut();
          } catch (error) {
            Alert.alert("Erreur", error.message);
          }
        },
      },
    ]);
  };

  return (
    <View style={profileStyles.container}>
      <View style={{ flex: 1, width: "100%", alignItems: "center", gap: 8 }}>
        <Avatar seed={username} size={104} />
        <Text style={profileStyles.name}>{username}</Text>
        <Text style={profileStyles.email}>{email}</Text>
        {location ? <Text style={profileStyles.city}>{location}</Text> : null}
        <View style={profileStyles.menu}>
          <TouchableOpacity
            onPress={() => navigation.navigate("ProfileUpdate")}
            style={profileStyles.menuItemContainer}
          >
            <PencilIcon color="white" strokeWidth={1.5} size={20} />
            <Text style={profileStyles.menuItem}>Modifier le profil</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleChangePassword}
            style={profileStyles.menuItemContainer}
          >
            <KeyRoundIcon color="white" strokeWidth={1.5} size={20} />
            <Text style={profileStyles.menuItem}>Changer de mot de passe</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={() => Alert.alert("Notifications", "Fonctionnalité à venir")}>
            <Text style={profileStyles.menuItem}>Notifications</Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            onPress={handleLogout}
            style={profileStyles.menuItemContainer}
          >
            <LogOutIcon color="#ff5f69" strokeWidth={1.5} size={20} />
            <Text style={profileStyles.logout}>Déconnexion</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={[
          profileStyles.menu,
          {
            alignSelf: "end",
            marginTop: 32,
            backgroundColor: "#ff5f6a14",
            borderColor: "#ff9ca234",
            borderWidth: 1,
          },
        ]}
      >
        <TouchableOpacity onPress={deleteAccount} style={profileStyles.menuItemContainer}>
          <Trash color="#ff5f69" strokeWidth={1.5} size={20} />
          <Text style={profileStyles.menuItemDestructive}>Supprimer le compte</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
