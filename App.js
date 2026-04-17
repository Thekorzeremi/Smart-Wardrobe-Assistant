import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { GlassTabBar } from "./components/GlassTabBar";
import { Home } from "./screens/Home";
import { Profile } from "./screens/Profile";
import { Wardrobe } from "./screens/Wardrobe";
import { Login } from "./screens/Login";
import { Register } from "./screens/Register";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

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
  return (
    <NavigationContainer>
      {user ? <AppTabs /> : <AuthStack />}
    </NavigationContainer>
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

export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}