import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, Text, View, ActivityIndicator } from "react-native";
import { HomeHeader } from "../components/HomeHeader";
import { WeatherCarousel } from "../components/WeatherCarousel";
import { elements } from "../theme";
import { useSuggestion } from '../hooks/use-suggest';

export const Home = () => {
  const { data: suggestion, isLoading, error, refresh } = useSuggestion();

  return (
    <LinearGradient
      colors={["rgba(0, 45, 101, 0.8)", "rgba(0, 9, 20, 0.8)"]}
      start={{ x: 0, y: 0.1 }}
      style={elements.homeBackground}
    >
      <ScrollView contentContainerStyle={elements.homeContainer}>
        <HomeHeader />
        <WeatherCarousel />

        <View style={elements.homeCard}>
          <Text style={elements.homeCardTitle}>Suggestion du jour</Text>
          
          {isLoading && <ActivityIndicator color="white" />}
          {error && <Text style={elements.homeCardText}>Erreur : {error.message}</Text>}
          {suggestion && (
            <Text style={elements.homeCardText}>{suggestion.recommendation}</Text>
          )}
        </View>

        <View style={elements.homeCard}>
          <Text style={elements.homeCardTitle}>Prochaine etape</Text>
          <Text style={elements.homeCardText}>
            Va dans l'onglet Armoire pour afficher ta garde-robe, ou Profil pour
            modifier ton compte.
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};
