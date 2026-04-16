import { StyleSheet, View } from "react-native";
// import { Navbar } from "./navbar";

export const Layout = ({ children }) => {
  return (
    <View style={layout.container}>
      {children}
      {/* <Navbar /> */}
    </View>
  );
};

export const layout = StyleSheet.create({
  container: {
    backgroundColor: "black",
    flex: 1,
    paddingVertical: 80,
    paddingHorizontal: 16,
  },
  title: {
    color: "white",
    fontWeight: "bold",
    fontSize: 24,
    textAlign: "center",
  },
});
