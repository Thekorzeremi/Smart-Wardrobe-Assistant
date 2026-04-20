import { EXPO_PUBLIC_RESET_URL } from "@env";
import { MailCheckIcon } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import FrostedCard from "../components/FrostedCard";
import { Layout } from "../components/Layout";
import { supabase } from "../services/supabase";
import { authStyles } from "../theme";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleReset = async () => {
    if (!email) return;
    setLoading(true);
    setError("");

    const resetUrl = __DEV__
      ? EXPO_PUBLIC_RESET_URL
      : "SmartWardrobe://reset-password";

    console.log(resetUrl);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: resetUrl,
    });

    if (error) setError(error.message);
    else setSent(true);

    setLoading(false);
  };

  if (sent) {
    return (
      <Layout>
        <View style={authStyles.container}>
          <FrostedCard>
            <Text style={{ fontSize: 48, textAlign: "center" }}>
              <MailCheckIcon color="#fff" />
            </Text>
            <Text style={authStyles.title}>Email envoyé !</Text>
            <Text style={[authStyles.subtitle, { marginBottom: 0 }]}>
              Vérifie ta boîte mail pour réinitialiser ton mot de passe.
            </Text>
          </FrostedCard>
        </View>
      </Layout>
    );
  }

  return (
    <Layout>
      <View style={authStyles.container}>
        <FrostedCard>
          <Text style={authStyles.title}>Mot de passe oublié</Text>
          <Text style={authStyles.subtitle}>
            Entre ton email pour recevoir un lien de réinitialisation.
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
          {error ? <Text style={authStyles.error}>{error}</Text> : null}
          <TouchableOpacity
            style={[authStyles.button, loading && authStyles.buttonDisabled]}
            onPress={handleReset}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={authStyles.buttonText}>Envoyer le lien</Text>
            )}
          </TouchableOpacity>
        </FrostedCard>
      </View>
    </Layout>
  );
};
