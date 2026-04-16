import { Home, Shirt, User, Coffee } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ICONS = {
  Accueil: Home,
  Armoire: Shirt,
  Profil: User,
};

export function GlassTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { bottom: Math.max(insets.bottom, 10) }]}>
      <View style={styles.mainPill}>
        <View style={styles.shine} />
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const Icon = ICONS[route.name] ?? Home;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          const { options } = descriptors[route.key];
          const label = options.tabBarLabel ?? options.title ?? route.name;

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              onLongPress={onLongPress}
              style={[styles.tab, isFocused && styles.tabActive]}
            >
              <Icon
                size={18}
                strokeWidth={2.2}
                color={isFocused ? "#f7f8fc" : "rgba(247, 248, 252, 0.76)"}
              />
              <Text style={[styles.label, isFocused && styles.labelActive]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable style={styles.sideAction}>
        <View style={styles.sideActionShine} />
        <Coffee size={20} strokeWidth={2.1} color="#f7f8fc" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    left: 16,
    right: 16,
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  mainPill: {
    flex: 1,
    position: "relative",
    flexDirection: "row",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.30)",
    backgroundColor: "rgba(85, 90, 108, 0.44)",
    overflow: "hidden",
    padding: 5,
    shadowColor: "#030611",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.42,
    shadowRadius: 22,
    elevation: 14,
  },
  shine: {
    position: "absolute",
    top: 0,
    left: 10,
    right: 10,
    height: "52%",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
  },
  tab: {
    flex: 1,
    borderRadius: 24,
    minHeight: 54,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  tabActive: {
    backgroundColor: "rgba(234, 236, 242, 0.34)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.40)",
  },
  label: {
    color: "rgba(247, 248, 252, 0.78)",
    fontSize: 13,
    fontWeight: "500",
  },
  labelActive: {
    color: "#ffffff",
    fontWeight: "600",
  },
  sideAction: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.30)",
    backgroundColor: "rgba(85, 90, 108, 0.44)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    shadowColor: "#030611",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.42,
    shadowRadius: 22,
    elevation: 14,
  },
  sideActionShine: {
    position: "absolute",
    top: 0,
    left: 8,
    right: 8,
    height: "52%",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
});
