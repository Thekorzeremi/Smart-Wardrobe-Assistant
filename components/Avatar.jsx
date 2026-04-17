import { View } from "react-native";
import { SvgXml } from "react-native-svg";
import { createAvatar } from "@dicebear/core";
import { openPeeps } from "@dicebear/collection";

export const Avatar = ({ seed, size = 104 }) => {
  const avatar = createAvatar(openPeeps, {
    seed,
    backgroundColor: "transparent",
  });
  const svgXml = avatar.toString();

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        overflow: "hidden",
        backgroundColor: "rgba(255,255,255,0.2)",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <SvgXml xml={svgXml} width="100%" height="100%" />
    </View>
  );
};