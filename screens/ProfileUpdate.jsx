import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../contexts/AuthContext";
import FrostedCard from "../components/FrostedCard";
import { Layout } from "../components/Layout";
import { Avatar } from "../components/Avatar";
import { authStyles } from "../styles/app.styles";

export const ProfileUpdate = () => {
  const navigation = useNavigation();
  const { userData, updateProfile } = useAuth();
  const [username, setUsername] = useState(userData?.username || "");
  const [city, setCity] = useState(userData?.city || "");
  const [country, setCountry] = useState(userData?.country || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!username.trim()) {
      Alert.alert("Erreur", "Le nom d'utilisateur est requis");
      return;
    }

    setLoading(true);
    try {
      await updateProfile({
        username: username.trim(),
        city: city.trim(),
        country: country.trim(),
      });
      Alert.alert("Succès", "Profil mis à jour", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert("Erreur", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <View style={authStyles.container}>
        <FrostedCard>
          <View style={{ alignItems: "center", marginBottom: 20 }}>
            <Avatar seed={username || userData?.username || "guest"} size={100} />
          </View>

          <Text style={authStyles.title}>Modifier mon profil</Text>
          <Text style={authStyles.subtitle}>
            Modifiez vos informations personnelles
          </Text>

          <TextInput
            style={authStyles.input}
            placeholder="Nom d'utilisateur"
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

          <TextInput
            style={authStyles.input}
            placeholder="Ville"
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={city}
            onChangeText={setCity}
          />

          <TextInput
            style={authStyles.input}
            placeholder="Pays"
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={country}
            onChangeText={setCountry}
          />

          <TouchableOpacity
            style={authStyles.button}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={authStyles.buttonText}>Enregistrer</Text>
            )}
          </TouchableOpacity>
        </FrostedCard>
      </View>
    </Layout>
  );
};