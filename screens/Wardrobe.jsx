import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { useGetClothesQuery } from "../services/wardrobe-service";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRefreshOnFocus } from "../hooks/use-refresh-on-focus";

export const Wardrobe = () => {
	useRefreshOnFocus();
	const { data, isLoading, error, refetch } = useGetClothesQuery();
	return (
		<SafeAreaView style={styles.container} edges={["top", "bottom"]}>
			<Text style={styles.title}>Mon Armoire</Text>
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
				<FlatList numColumns={2} columnWrapperStyle={styles.gridItem} data={data} renderItem={({ item }) => <WardrobeItem item={item} />} />
		</SafeAreaView>
	);
};

const WardrobeItem = ({ item }) => (
	<View key={item} style={styles.itemCard}>
		{/* <View  /> */}
		<View style={styles.imagePlaceholder}>
			<Image 
				resizeMode="cover"
				source={{ uri: "https://media1.tenor.com/m/wb_rblUTxVAAAAAd/boat-kid-aura-farming-pacu-jalur.gif" }} 
				style={{ width: "100%", height: "100%" }}
			/>
		</View>
		<Text style={styles.itemTitle}>{item.name}</Text>
	</View>
)

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		backgroundColor: "#05070f",
		paddingHorizontal: 16,
	},
	title: {
		color: "#f3f5ff",
		fontSize: 32,
		fontWeight: "700",
		marginBottom: 16,
	},
	grid: {
		gap: 12,
		// backgroundColor: "red",
		flex: 1,
		// marginBottom: 100,
	},
	gridItem: {
		gap: 12,
		flex: 1,
	},
	itemCard: {
		width: "48%",
		borderRadius: 18,
		borderWidth: 1,
		borderColor: "rgba(255,255,255,0.14)",
		backgroundColor: "rgba(255,255,255,0.08)",
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
