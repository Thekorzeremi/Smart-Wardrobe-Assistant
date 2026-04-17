import { Home, Shirt, User, Coffee } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, elements } from "../theme";

const ICONS = {
  Accueil: Home,
  Armoire: Shirt,
  Profil: User,
};

const ACTIVE_ICON_COLOR = colors.glassTab.iconActive;
const INACTIVE_ICON_COLOR = colors.glassTab.iconInactive;
const SIDE_ICON_COLOR = colors.glassTab.sideIcon;

export function GlassTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[elements.glassTabWrapper, { bottom: Math.max(insets.bottom, 10) }]}>
      <View style={elements.glassTabMainPill}>
        <BlurView
          intensity={colors.glassTab.blurMainIntensity}
          tint={colors.glassTab.blurTint}
          style={elements.glassTabBlur}
        />
        <View pointerEvents="none" style={elements.glassTabInnerBorder} />
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
        <BlurView
          intensity={colors.glassTab.blurSideIntensity}
          tint={colors.glassTab.blurTint}
          style={elements.glassTabSideActionBlur}
        />
        <View pointerEvents="none" style={elements.glassTabSideActionInnerBorder} />
        <Coffee size={20} strokeWidth={2.1} color={SIDE_ICON_COLOR} />
      </Pressable>
    </View>
  );
}
