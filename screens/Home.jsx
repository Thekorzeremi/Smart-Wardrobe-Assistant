import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, Text, View, ActivityIndicator, Image } from "react-native";
import { HomeHeader } from "../components/HomeHeader";
import { WeatherCarousel } from "../components/WeatherCarousel";
import { useSuggestion } from '../hooks/use-suggest';
import { colors, elements } from "../theme";

export const Home = () => {
  const { data: suggestion, isLoading, error, refresh } = useSuggestion();


  return (
    <LinearGradient
      colors={[colors.backgroundHomeLinearFrom, colors.backgroundHomeLinearTo]}
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
            <>
              <Text style={elements.homeCardText}>
                {suggestion.explanation}
              </Text>
              <Text style={[elements.homeCardText, { marginTop: 10 }]}>
                Confort : {suggestion.comfort_score}/10
              </Text>
              {suggestion?.clothes && (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
                  {suggestion.clothes.map(item => (
                    <View
                      key={item.id}
                      style={{ width: '30%', margin: '1.5%', alignItems: 'center' }}
                    >
                      <Image
                        source={{ uri: item.image_url || "https://media1.tenor.com/m/wb_rblUTxVAAAAAd/boat-kid-aura-farming-pacu-jalur.gif" }}
                        style={{ width: 80, height: 80, borderRadius: 15 }}
                      />
                      <Text style={{ color: 'white', marginTop: 5, textAlign: 'center' }}>
                        {item.name}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </>
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
