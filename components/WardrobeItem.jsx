import { Image, Text, View, TouchableOpacity} from "react-native";
import { elements } from "../theme";

export const WardrobeItem = ({ item, onPress }) => (
  <TouchableOpacity
    style={elements.wardrobeItemCard}
    onPress={onPress}
    activeOpacity={0.85}
  >
    <View style={elements.wardrobeImagePlaceholder}>
      <Image
        resizeMode="cover"
        source={{
          uri: item.image_url || "https://media1.tenor.com/m/wb_rblUTxVAAAAAd/boat-kid-aura-farming-pacu-jalur.gif",
        }}
        style={elements.wardrobeItemImage}
      />
    </View>
    <Text style={elements.wardrobeItemTitle}>{item.name}</Text>
  </TouchableOpacity>
);