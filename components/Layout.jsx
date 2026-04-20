import { View } from "react-native";
import { elements } from "../theme";

export const Layout = ({ children }) => {
  return (
    <View style={elements.layoutContainer}>
      {children}
      {/* <Navbar /> */}
    </View>
  );
};
