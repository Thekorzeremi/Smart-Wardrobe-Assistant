import { ActivityIndicator, View } from "react-native";
import { Layout } from "../components/Layout";

export const Loading = () => {
  return (
    <Layout>
      <View
        style={{
          flex: 1,
          flexDirection: "cols",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size={"large"} />
      </View>
    </Layout>
  );
};
