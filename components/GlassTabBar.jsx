import { Home, Shirt, User, Coffee } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, elements } from "../theme";

const ICONS = {
  Accueil: Home,
  Armoire: Shirt,
  Profil: User,
};

const ACTIVE_ICON_COLOR = colors.glassTab.iconActive;
const INACTIVE_ICON_COLOR = colors.glassTab.iconInactive;

export function GlassTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[elements.glassTabWrapper, { bottom: Math.max(insets.bottom, 10) }]}>
      <View style={elements.glassTabMainPill}>
        <View style={elements.glassTabShine} />
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
              style={[elements.glassTabItem, isFocused && elements.glassTabActive]}
            >
              <Icon
                size={18}
                strokeWidth={2.2}
                color={isFocused ? ACTIVE_ICON_COLOR : INACTIVE_ICON_COLOR}
              />
              <Text
                style={[
                  elements.glassTabLabel,
                  isFocused && elements.glassTabLabelActive,
                ]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable style={elements.glassTabSideAction}>
        <View style={elements.glassTabSideActionShine} />
        <Coffee size={20} strokeWidth={2.1} color={ACTIVE_ICON_COLOR} />
      </Pressable>
    </View>
  );
}
