import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home } from "./screens/Home";
import { Login } from "./screens/Login";
import { Profile } from "./screens/Profile";
import { ProfileUpdate } from "./screens/ProfileUpdate";
import { Register } from "./screens/Register";
import { Wardrobe } from "./screens/Wardrobe";
import { WardrobeCreate } from "./screens/WardrobeCreate";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ title: "Accueil" }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{ title: "Accueil" }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ title: "Accueil" }}
        />
        <Stack.Screen
          name="Wardrobe"
          component={Wardrobe}
          options={{ title: "Armoire" }}
        />
        <Stack.Screen
          name="WardrobeCreate"
          component={WardrobeCreate}
          options={{ title: "Ajouter un vêtement" }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{ title: "Profil" }}
        />
        <Stack.Screen
          name="ProfileUpdate"
          component={ProfileUpdate}
          options={{ title: "Modifier le profil" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
