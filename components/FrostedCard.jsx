import { View } from "react-native";
import { elements } from "../theme";

export default function FrostedCard({ children, style }) {
  return <View style={[elements.frostedCard, style]}>{children}</View>;
}
