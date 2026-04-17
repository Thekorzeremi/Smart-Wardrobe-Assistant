import { Image, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme";

export const WardrobeItem = ({ item, variant = "wardrobe" }) => (
  <View key={item} style={[styles.itemCard, variantStyles[variant]]}>
    {/* <View  /> */}
    <View style={styles.imagePlaceholder}>
      <Image
        resizeMode="cover"
        source={{
          uri: "https://media1.tenor.com/m/wb_rblUTxVAAAAAd/boat-kid-aura-farming-pacu-jalur.gif",
        }}
        style={{ width: "100%", height: "100%" }}
      />
    </View>
    <Text style={styles.itemTitle}>{item.name}</Text>
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

const styles = StyleSheet.create({
  itemCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 10,
    marginBottom: 12,
  },
  imagePlaceholder: {
    height: 100,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.13)",
    marginBottom: 10,
    overflow: "hidden",
  },
  itemTitle: {
    color: "#eef1ff",
    fontSize: 15,
    fontWeight: "500",
  },
});
