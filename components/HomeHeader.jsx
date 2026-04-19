import { Text, View } from "react-native";
import { useDate } from "../hooks/useDate";
import { useWeather } from "../hooks/useWeather";
import { Loading } from "../screens/Loading";
import { elements } from "../theme";

export const HomeHeader = ({ username }) => {
  const { data, isLoading } = useWeather();
  const { date } = useDate();

  const { city, country } = data ?? {};

  if (isLoading) return <Loading />;
  return (
    <>
      <Text style={elements.homeHeaderHello}>Bonjour, {username}</Text>
      <View style={elements.homeHeaderRow}>
        <View style={elements.homeHeaderLeft}>
          <Text style={elements.homeHeaderTitle}>
            {city}, {country}
          </Text>
          <Text style={elements.homeHeaderDate}>{date}</Text>
        </View>
      </View>
    </>
  );
};
