import { ActivityIndicator, View } from "react-native";
import { Layout } from "../components/Layout";
import { elements } from "../theme";

export const Loading = () => {
  return (
    <Layout>
      <View style={elements.loadingContainer}>
        <ActivityIndicator size={"large"} />
      </View>
    </Layout>
  );
};
