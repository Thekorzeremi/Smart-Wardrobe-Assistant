import { useEffect, useMemo, useRef, useState } from "react";
import { Home, Shirt, User, Coffee } from "lucide-react-native";
import { Animated, Easing, Pressable, Text, View } from "react-native";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, elements, glassTabMotion } from "../theme";

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
  const [pillWidth, setPillWidth] = useState(0);

  const translateX = useRef(new Animated.Value(0)).current;
  const bubbleScaleY = useRef(new Animated.Value(1)).current;
  const bubbleScaleX = useRef(new Animated.Value(1)).current;
  const activeIndexRef = useRef(state.index);
  const runningAnimationRef = useRef(null);

  const tabWidth = useMemo(() => {
    if (pillWidth <= 0 || state.routes.length === 0) {
      return 0;
    }

    return (pillWidth - glassTabMotion.pillInset * 2) / state.routes.length;
  }, [pillWidth, state.routes.length]);

  useEffect(() => {
    if (tabWidth <= 0) {
      return;
    }

    const targetX = state.index * tabWidth;

    if (activeIndexRef.current === state.index) {
      translateX.setValue(targetX);
      return;
    }

    if (runningAnimationRef.current) {
      runningAnimationRef.current.stop();
    }

    const hopDistance = Math.abs(state.index - activeIndexRef.current);
    const slideDuration = 100 + hopDistance * 40;

    const sequence = Animated.sequence([
      Animated.parallel([
        Animated.timing(bubbleScaleY, {
          toValue: glassTabMotion.activeBubbleFullHeightScale,
          duration: 5,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(bubbleScaleX, {
          toValue: 1.08,
          duration: 5,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: targetX,
          duration: slideDuration,
          easing: Easing.bezier(0.22, 0.9, 0.24, 1),
          useNativeDriver: true,
        }),
        Animated.timing(bubbleScaleY, {
          toValue: glassTabMotion.activeBubbleFullHeightScale,
          duration: slideDuration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(bubbleScaleX, {
          toValue: Math.min(1.26, 1.14 + hopDistance * 0.06),
          duration: slideDuration,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(bubbleScaleY, {
          toValue: 1,
          duration: 100,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(bubbleScaleX, {
          toValue: 1,
          duration: 100,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]);

    runningAnimationRef.current = sequence;
    sequence.start(() => {
      activeIndexRef.current = state.index;
      runningAnimationRef.current = null;
    });
  }, [bubbleScaleX, bubbleScaleY, state.index, tabWidth, translateX]);

  return (
    <View style={[elements.glassTabWrapper, { bottom: Math.max(insets.bottom, 10) }]}>
      <View
        style={elements.glassTabMainPill}
        onLayout={(event) => setPillWidth(event.nativeEvent.layout.width)}
      >
        <BlurView
          intensity={colors.glassTab.blurMainIntensity}
          tint={colors.glassTab.blurTint}
          experimentalBlurMethod="dimezisBlurView"
          reducedTransparencyFallbackColor="rgba(10,12,16,0.58)"
          style={elements.glassTabBlur}
        />
        {tabWidth > 0 && (
          <Animated.View
            pointerEvents="none"
            style={[
              elements.glassTabActive,
              elements.glassTabActiveBubbleBase,
              {
                width: tabWidth - glassTabMotion.activeBubbleHorizontalInset * 2,
                transform: [
                  { translateX },
                  { scaleX: bubbleScaleX },
                  { scaleY: bubbleScaleY },
                ],
              },
            ]}
          />
        )}
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
              style={[elements.glassTabItem, elements.glassTabTabLayer]}
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
          experimentalBlurMethod="dimezisBlurView"
          reducedTransparencyFallbackColor="rgba(10,12,16,0.58)"
          style={elements.glassTabSideActionBlur}
        />
        <View pointerEvents="none" style={elements.glassTabSideActionInnerBorder} />
        <Coffee size={20} strokeWidth={2.1} color={SIDE_ICON_COLOR} />
      </Pressable>
    </View>
  );
}
