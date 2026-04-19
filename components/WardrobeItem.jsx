import { Image, StyleSheet, Text, View } from "react-native";
import { colors, elements } from "../theme";

export const WardrobeItem = ({ item, variant = "wardrobe" }) => (
  <View key={item} style={[elements.itemCard, variantStyles[variant]]}>
    {/* <View  /> */}
    <View style={elements.imagePlaceholder}>
      <Image
        resizeMode="cover"
        source={{
          uri: "https://media1.tenor.com/m/wb_rblUTxVAAAAAd/boat-kid-aura-farming-pacu-jalur.gif",
        }}
        style={{ width: "100%", height: "100%" }}
      />
    </View>
    <Text style={elements.itemTitle}>{item.name}</Text>
  </View>
);

const variantStyles = {
  home: {
    backgroundColor: colors.cardHome.backgroundColor,
    borderColor: colors.cardHome.borderColor,
    width: "100%",
  },
  wardrobe: {
    backgroundColor: colors.cardWardrobe.backgroundColor,
    borderColor: colors.cardWardrobe.borderColor,
    width: "48%",
  },
};
