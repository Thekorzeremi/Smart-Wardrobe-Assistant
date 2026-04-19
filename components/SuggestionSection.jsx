import { ActivityIndicator, Image, Text, View } from "react-native";
import { Button } from "./Button";
import { ListFilter, RefreshCcwIcon } from "lucide-react-native";
import { useSuggestion, getDayKey } from "../hooks/use-suggest";
import { elements } from "../theme";
import { FilterModal } from "./FilterModal";
import { useState, useEffect, useCallback, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";
export const SuggestionSection = () => {
  const [filters, setFilters] = useState({});
  const { data: suggestion, isLoading, error, refresh } = useSuggestion(filters);
  const [modalVisible, setModalVisible] = useState(false);
  const lastDayKeyRef = useRef(getDayKey());
  
  useEffect(() => {
    if (suggestion) {
      lastDayKeyRef.current = getDayKey();
    }
  }, [suggestion]);

  useFocusEffect(
    useCallback(() => {
      const currentDayKey = getDayKey();
      if (currentDayKey !== lastDayKeyRef.current) {
        refresh();
      }
    }, [refresh])
  );

  const handleFilterPress = () => {
    setModalVisible(true);
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    refresh();
  };

  const handleRefreshPress = () => {
    refresh();
  };

  return (
    <View style={elements.homeCard}>
      <View style={{ flexDirection: 'row' }}>
        <Text style={elements.homeCardTitle}>Suggestion du jour</Text>
        <View style={{ marginLeft: 'auto', flexDirection: 'row', gap: 8, margin: 5 }}>
          <Button onPress={handleFilterPress} variant="icon">
            <ListFilter color="white" size={20} />
          </Button>
          <Button onPress={handleRefreshPress} variant="icon">
            <RefreshCcwIcon color="white" size={20} />
          </Button>
        </View>
      </View>

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
          <FilterModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            onApply={handleApplyFilters}
            initialFilters={filters}
          />
        </>
      )}
    </View>
  );
};