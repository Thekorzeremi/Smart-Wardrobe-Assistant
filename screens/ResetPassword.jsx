import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import FrostedCard from "../components/FrostedCard";
import { Layout } from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../services/supabase";
import { authStyles } from "../theme";

export const ResetPassword = ({ navigation }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setIsRecovery } = useAuth();

  const handleUpdate = async () => {
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
    } else {
      setIsRecovery(false);
      await supabase.auth.signOut();
    }
  };

  return (
    <Layout>
      <View style={authStyles.container}>
        <FrostedCard>
          <Text style={authStyles.title}>Nouveau mot de passe</Text>
          <TextInput
            style={authStyles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Nouveau mot de passe"
            placeholderTextColor="rgba(255,255,255,0.5)"
            secureTextEntry
          />
          {error ? <Text style={authStyles.error}>{error}</Text> : null}
          <TouchableOpacity style={authStyles.button} onPress={handleUpdate}>
            <Text style={authStyles.buttonText}>Mettre à jour</Text>
          </TouchableOpacity>
        </FrostedCard>
      </View>
    </Layout>
  );
};
