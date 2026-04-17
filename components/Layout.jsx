import { View } from "react-native";
import { elements } from "../theme";
// import { Navbar } from "./navbar";

export const Layout = ({ children }) => {
  return (
	<View style={elements.layoutContainer}>
      {children}
      {/* <Navbar /> */}
    </View>
  );
};
