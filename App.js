import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { GlassTabBar } from "./components/GlassTabBar";
import { Home } from "./screens/Home";
import { Profile } from "./screens/Profile";
import { Wardrobe } from "./screens/Wardrobe";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
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
  );
}
