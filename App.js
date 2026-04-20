import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  createNavigationContainerRef,
  NavigationContainer,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  focusManager,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import * as Linking from "expo-linking";
import { useEffect } from "react";
import { AppState, Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GlassTabBar } from "./components/GlassTabBar";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ForgotPassword } from "./screens/ForgotPassword";
import { Home } from "./screens/Home";
import { Login } from "./screens/Login";
import { Profile } from "./screens/Profile";
import { ProfileUpdate } from "./screens/ProfileUpdate";
import { Register } from "./screens/Register";
import { ResetPassword } from "./screens/ResetPassword";
import { Wardrobe } from "./screens/Wardrobe";
import { supabase } from "./services/supabase";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();
export const navigationRef = createNavigationContainerRef();

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
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
    </Stack.Navigator>
  );
}

function AppTabs() {
  return (
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
  const { user, loading, isRecovery } = useAuth();
  if (loading) return null;
  if (isRecovery) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
      </Stack.Navigator>
    );
  }

  return user ? <AppStack /> : <AuthStack />;
}

function DeepLinkHandler() {
  const { setIsRecovery } = useAuth();

  useEffect(() => {
    const handleDeepLink = async (url) => {
      if (!url || !url.includes("type=recovery")) return;

      console.log("🔗 Recovery URL détectée:", url);

      const params = new URLSearchParams(url.split("#")[1]);
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");
      const type = params.get("type");

      if (access_token && refresh_token && type === "recovery") {
        setIsRecovery(true);
        await supabase.auth.setSession({ access_token, refresh_token });
      }
    };

    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink(url);
    });

    const subscription = Linking.addEventListener("url", ({ url }) => {
      handleDeepLink(url);
    });

    return () => subscription.remove();
  }, []);

  return null;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <AuthProvider>
          <DeepLinkHandler />
          <NavigationContainer ref={navigationRef}>
            <RootNavigator />
          </NavigationContainer>
        </AuthProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
