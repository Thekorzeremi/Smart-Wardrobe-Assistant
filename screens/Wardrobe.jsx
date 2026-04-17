import { ActivityIndicator, FlatList, Text, TouchableOpacity, View, Image } from "react-native";
import { useGetClothesQuery } from "../services/wardrobe-service";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRefreshOnFocus } from "../hooks/use-refresh-on-focus";
import { elements } from "../theme";

export const Wardrobe = () => {
	useRefreshOnFocus();
	const { data, isLoading, error, refetch } = useGetClothesQuery();
	return (
		<SafeAreaView style={elements.wardrobeContainer} edges={["top", "bottom"]}>
			<Text style={elements.wardrobeTitle}>Mon Armoire</Text>
			{
				isLoading ? <ActivityIndicator size="large" color="#f3f5ff" /> : null
			}
			{
				error ? (
					<View>
						<Text>Une erreur est survenue</Text>
						<Text>{error.message}</Text>
						<TouchableOpacity onPress={refetch}>
							<Text>Réessayer</Text>
						</TouchableOpacity>
					</View>
				) : null
			}
				<FlatList numColumns={2} columnWrapperStyle={elements.wardrobeGridItem} data={data} renderItem={({ item }) => <WardrobeItem item={item} />} />
		</SafeAreaView>
	);
};

const WardrobeItem = ({ item }) => (
	<View key={item} style={elements.wardrobeItemCard}>
		{/* <View  /> */}
		<View style={elements.wardrobeImagePlaceholder}>
			<Image 
				resizeMode="cover"
				source={{ uri: "https://media1.tenor.com/m/wb_rblUTxVAAAAAd/boat-kid-aura-farming-pacu-jalur.gif" }} 
				style={elements.wardrobeItemImage}
			/>
		</View>
		<Text style={elements.wardrobeItemTitle}>{item.name}</Text>
	</View>
)
