import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, Text, View, ActivityIndicator } from "react-native";
import { HomeHeader } from "../components/HomeHeader";
import { WeatherCarousel } from "../components/WeatherCarousel";
import { colors, elements } from "../theme";
import {useAuth} from "../contexts/AuthContext";
import { SuggestionSection } from "../components/SuggestionSection";

export const Home = () => {
  const { userData, loading: authLoading } = useAuth();
  const username = userData?.username || "Utilisateur";

  if (authLoading) {
    return (
        <View style={[elements.homeBackground, { justifyContent: 'center' }]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
    );
  }
  return (
    <LinearGradient
      colors={[colors.backgroundHomeLinearFrom, colors.backgroundHomeLinearTo]}
      start={{ x: 0, y: 0.1 }}
      style={elements.homeBackground}
    >
      <ScrollView contentContainerStyle={elements.homeContainer}>
        <HomeHeader username={username}/>
        <WeatherCarousel />
        <SuggestionSection />
        
        <View style={elements.homeCard}>
          <Text style={elements.homeCardTitle}>Prochaine etape</Text>
          <Text style={elements.homeCardText}>
            Va dans l'onglet Armoire pour afficher ta garde-robe, ou Profil pour modifier
            ton compte.
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};
