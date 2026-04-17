import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { usePhoneLocation } from "../services/geocoding-service";

export const Profile = () => {
	const add = usePhoneLocation()

	const { user, signOut } = useAuth();
	const username = user?.email?.split("@")[0];
	const firstLetter = username?.charAt(0);
	return (
		<View style={styles.container}>
			<View style={styles.avatar}>
				<Text style={styles.avatarText}>{firstLetter.toUpperCase()}</Text>
			</View>
			<Text style={styles.name}>{username}</Text>
			<Text style={styles.city}>{add?.city} - {add?.country}</Text>

			<View style={styles.menu}>
				<Text style={styles.menuItem}>Modifier le profil</Text>
				<Text style={styles.menuItem}>Notifications</Text>
				<TouchableOpacity style={styles.menuItem} onPress={() => console.log("signout bro")}>
					<Text style={styles.logout}>Déconnexion</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#05070f",
		alignItems: "center",
		paddingTop: 92,
		paddingHorizontal: 20,
		paddingBottom: 110,
	},
	avatar: {
		width: 104,
		height: 104,
		borderRadius: 52,
		backgroundColor: "rgba(255,255,255,0.2)",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 18,
	},
	avatarText: {
		color: "#f3f5ff",
		fontSize: 38,
		fontWeight: "700",
	},
	name: {
		color: "#f3f5ff",
		fontSize: 35,
		fontWeight: "700",
	},
	city: {
		color: "rgba(243,245,255,0.72)",
		fontSize: 20,
		marginTop: 4,
	},
	menu: {
		width: "100%",
		borderRadius: 20,
		borderWidth: 1,
		borderColor: "rgba(255,255,255,0.14)",
		backgroundColor: "rgba(132, 137, 255, 0.14)",
		marginTop: 28,
		paddingVertical: 12,
		paddingHorizontal: 16,
		gap: 14,
	},
	menuItem: {
		color: "#f3f5ff",
		fontSize: 20,
		fontWeight: "500",
	},
	logout: {
		color: "#ff5f69",
		fontSize: 20,
		fontWeight: "600",
	},
});
