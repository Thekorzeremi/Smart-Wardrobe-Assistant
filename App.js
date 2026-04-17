import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  focusManager,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useEffect } from "react";
import { AppState, AppStateStatus, Platform } from "react-native";
import { GlassTabBar } from "./components/GlassTabBar";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Home } from "./screens/Home";
import { Login } from "./screens/Login";
import { Profile } from "./screens/Profile";
import { Register } from "./screens/Register";
import { Wardrobe } from "./screens/Wardrobe";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const qc = new QueryClient();

/**
 *
 * @param {AppStateStatus} status
 */
function onAppStateChange(status) {
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active");
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
    const subscription = AppState.addEventListener("change", onAppStateChange);
    return () => subscription.remove();
  }, []);
  return (
    <QueryClientProvider client={qc}>
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
    </QueryClientProvider>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </NavigationContainer>
  );
}
