import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GlassTabBar } from "./components/GlassTabBar";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Home } from "./screens/Home";
import { Wardrobe } from "./screens/Wardrobe";
import { ProfileUpdate } from "./screens/ProfileUpdate";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { AppState, Platform } from "react-native";
import { focusManager } from "@tanstack/react-query";
import { Login } from "./screens/Login";
import { Profile } from "./screens/Profile";
import { Register } from "./screens/Register";
import { Coffee, Plus, Dice5 } from "lucide-react-native";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

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
function AppTabs() {
  const getSideActionConfig = ({ routeName, navigation }) => {
    if (routeName === "Accueil") {
      return {
        Icon: Dice5,
        onPress: () => {},
      };
    }

    if (routeName === "Armoire") {
      return {
        Icon: Plus,
        onPress: () => {},
      };
    }

    if (routeName === "Profil") {
      return {
        Icon: Coffee,
        onPress: () => {
          alert("Prendre un café", "Fonctionnalité à venir", [
			{ text: "Annuler", style: "cancel" },
			{ text: "OK", onPress: () => alert("Café pris ! Fonctionnalité à venir") },
		  ]);
        },
      };
    }

    return {
      Icon: Coffee,
    };
  };

  return (
    <Tab.Navigator
      initialRouteName="Accueil"
      tabBar={(props) => (
        <GlassTabBar {...props} getSideActionConfig={getSideActionConfig} />
      )}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: "#05070f" },
      }}
    >
      <Tab.Screen name="Accueil" component={Home} />
      <Tab.Screen name="Armoire" component={Wardrobe} />
      <Tab.Screen name="Profil" component={Profile} />
    </Tab.Navigator>
  );
}
function AppStack() {
  useEffect(() => {
    const subscription = AppState.addEventListener("change", onAppStateChange);
    return () => subscription.remove();
  }, []);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={AppTabs} />
      <Stack.Screen name="ProfileUpdate" component={ProfileUpdate} />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <AppStack /> : <AuthStack />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <AuthProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </AuthProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
