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

export const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }
    setLoading(true);
    try {
      await signIn(email, password);
    } catch (error) {
      Alert.alert("Échec de connexion", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <View style={authStyles.container}>
        <FrostedCard>
          <Text style={authStyles.title}>Bienvenue sur SmartWardrobe</Text>
          <Text style={authStyles.subtitle}>Connectez-vous</Text>

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
            placeholder="Mot de passe"
            placeholderTextColor="rgba(255,255,255,0.5)"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            style={authStyles.button}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={authStyles.buttonText}>Se connecter</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={authStyles.link}>Pas encore de compte ? Créer un compte</Text>
          </TouchableOpacity>
        </FrostedCard>
      </View>
    </Layout>
  );
};
