import { View } from "react-native";
import { SvgXml } from "react-native-svg";
import { createAvatar } from "@dicebear/core";
import { openPeeps } from "@dicebear/collection";
import { avatarContainerStyle } from "../theme";

export const Avatar = ({ seed, size = 104 }) => {
  const avatar = createAvatar(openPeeps, {
    seed,
    backgroundColor: "transparent",
  });
  const svgXml = avatar.toString();

  return (
    <View style={avatarContainerStyle(size)}>
      <SvgXml xml={svgXml} width="100%" height="100%" />
    </View>
  );
};
