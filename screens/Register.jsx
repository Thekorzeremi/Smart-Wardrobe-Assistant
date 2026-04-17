import FrostedCard from "../components/FrostedCard";
import { Layout } from "../components/Layout";
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { authStyles } from "../theme";

export const Register = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert("Erreur", "Tous les champs sont requis");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Erreur", "Le mot de passe doit contenir au moins 6 caractères");
      return;
    }
    setLoading(true);
    try {
      await signUp(email, password);
      Alert.alert("Succès", "Compte créé ! Vous pouvez vous connecter.");
      navigation.navigate("Login");
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
          <Text style={authStyles.title}>Inscription</Text>
          <Text style={authStyles.subtitle}>
            {" "}
            Inscrivez vous et créez votre garde-robe intelligente
          </Text>

          <TextInput
            style={authStyles.input}
            placeholder="Email"
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={authStyles.input}
            placeholder="Mot de passe (min. 6 caractères)"
            placeholderTextColor="rgba(255,255,255,0.5)"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            style={authStyles.button}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={authStyles.buttonText}>S'inscrire</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={authStyles.link}>Déjà un compte ? Se connecter</Text>
          </TouchableOpacity>
        </FrostedCard>
      </View>
    </Layout>
  );
};
