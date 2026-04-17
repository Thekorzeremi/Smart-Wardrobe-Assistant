import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GlassTabBar } from "./components/GlassTabBar";
import { Home } from "./screens/Home";
import { Profile } from "./screens/Profile";
import { Wardrobe } from "./screens/Wardrobe";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from 'react'
import { AppState, Platform, AppStateStatus } from 'react-native'
import { focusManager } from '@tanstack/react-query'
import { Login } from "./screens/Login";
import { Register } from "./screens/Register";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

<<<<<<< feat/h0_dev3
export default function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Tab.Navigator
            initialRouteName="Accueil"
            tabBar={(props) => <GlassTabBar {...props} />}
            screenOptions={{
              headerShown: false,
              sceneStyle: { backgroundColor: "#05070f" },
            }}
          >
            <Tab.Screen name="Accueil" component={Home} />
            <Tab.Screen name="Armoire" component={Wardrobe} />
            <Tab.Screen name="Profil" component={Profile} />
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
=======
const qc = new QueryClient();

/**
 * 
 * @param {AppStateStatus} status
 */
function onAppStateChange(status) {
	if (Platform.OS !== 'web') {
		focusManager.setFocused(status === 'active')
	}
}

function AuthStack() {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name="Login" component={Login} />
			<Stack.Screen name="Register" component={Register} />
		</Stack.Navigator>
	);
}

function RootNavigator() {
	const { user, loading } = useAuth();
	if (loading) return null; // Tu peux ajouter un écran de chargement
	return user ? <AppTabs /> : <AuthStack />;
}

function AppTabs() {
	useEffect(() => {
		const subscription = AppState.addEventListener('change', onAppStateChange)
		return () => subscription.remove()
	}, [])
	return (
		<QueryClientProvider client={qc}>
			<NavigationContainer>
				<Tab.Navigator
					initialRouteName="Accueil"
					tabBar={(props) => <GlassTabBar {...props} />}
					screenOptions={{
						headerShown: false,
						sceneStyle: { backgroundColor: "#05070f" },
					}}
				>
					<Tab.Screen name="Accueil" component={Home} />
					<Tab.Screen name="Armoire" component={Wardrobe} />
					<Tab.Screen name="Profil" component={Profile} />
				</Tab.Navigator>
			</NavigationContainer>
		</QueryClientProvider>
	);
>>>>>>> main
}

export default function App() {
	return (
		<AuthProvider>
			<RootNavigator />
		</AuthProvider>
	);
}