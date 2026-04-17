import { ListFilter } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import { useDate } from "../hooks/useDate";
import { useWeather } from "../hooks/useWeather";
import { Loading } from "../screens/Loading";
import { Button } from "./Button";

export const HomeHeader = () => {
  const { data, isLoading } = useWeather();
  const { date } = useDate();

  const { city, country } = data ?? {};

  if (isLoading) return <Loading />;
  return (
    <>
      <Text style={styles.hello}>Bonjour, Remi</Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "start",
          gap: 12,
          justifyContent: "space-between",
        }}
      >
        <View style={{ gap: 4 }}>
          <Text style={styles.title}>
            {city}, {country}
          </Text>
          <Text style={styles.date}>{date}</Text>
        </View>
        <Button onPress={() => alert("Filtre")} variant="icon">
          <ListFilter color="white" size={28} />
        </Button>
      </View>
    </>
  );
};

export const styles = StyleSheet.create({
  hello: {
    color: "#b4c0ff",
    fontSize: 16,
  },
  title: {
    color: "#f3f5ff",
    fontSize: 32,
    fontWeight: "600",
  },
  date: {
    color: "#f3f5ff",
    fontSize: 20,
    fontWeight: "300",
  },
});
