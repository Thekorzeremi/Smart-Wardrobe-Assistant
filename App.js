import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { GlassTabBar } from "./components/GlassTabBar";
import { Home } from "./screens/Home";
import { Profile } from "./screens/Profile";
import { Wardrobe } from "./screens/Wardrobe";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from 'react'
import { AppState, Platform, AppStateStatus } from 'react-native'
import { focusManager } from '@tanstack/react-query'

const Tab = createBottomTabNavigator();

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

export default function App() {

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
}
