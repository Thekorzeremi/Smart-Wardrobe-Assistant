import { useEffect, useMemo, useRef, useState } from "react";
import { Home, Shirt, User, Coffee } from "lucide-react-native";
import { Animated, Easing, PanResponder, Pressable, Text, View } from "react-native";
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
const DRAG_ACTIVATION_PX = 8;

export function GlassTabBar({ state, descriptors, navigation, getSideActionConfig }) {
  const insets = useSafeAreaInsets();
  const [pillWidth, setPillWidth] = useState(0);
  const [visualActiveIndex, setVisualActiveIndex] = useState(state.index);
  const mainPillRef = useRef(null);

  const translateX = useRef(new Animated.Value(0)).current;
  const bubbleScaleY = useRef(new Animated.Value(1)).current;
  const bubbleScaleX = useRef(new Animated.Value(1)).current;
  const activeIndexRef = useRef(state.index);
  const runningAnimationRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragBubbleXRef = useRef(0);
  const pillPageXRef = useRef(0);
  const visualActiveIndexRef = useRef(state.index);

  const activeRoute = state.routes[state.index];

  const sideActionConfig = useMemo(() => {
    const configFromProp =
      typeof getSideActionConfig === "function"
        ? getSideActionConfig({
            route: activeRoute,
            routeName: activeRoute?.name,
            navigation,
            state,
            descriptors,
          })
        : null;

    const configFromScreen = activeRoute
      ? descriptors[activeRoute.key]?.options?.sideAction
      : null;

    return {
      ...(configFromScreen ?? {}),
      ...(configFromProp ?? {}),
    };
  }, [activeRoute, descriptors, getSideActionConfig, navigation, state]);

  const SideActionIcon = sideActionConfig.Icon ?? sideActionConfig.icon ?? Coffee;
  const sideActionIconColor = sideActionConfig.iconColor ?? SIDE_ICON_COLOR;
  const sideActionIconSize = sideActionConfig.iconSize ?? 20;
  const sideActionIconStrokeWidth = sideActionConfig.iconStrokeWidth ?? 2.1;

  const onSideActionPress = () => {
    const context = {
      route: activeRoute,
      routeName: activeRoute?.name,
      navigation,
      state,
      descriptors,
    };

    if (typeof sideActionConfig.onPress === "function") {
      const shouldContinue = sideActionConfig.onPress(context);
      if (shouldContinue === false) {
        return;
      }
    }

    if (typeof sideActionConfig.navigateTo === "string") {
      navigation.navigate(sideActionConfig.navigateTo, sideActionConfig.navigateParams);
    }
  };

  const tabWidth = useMemo(() => {
    if (pillWidth <= 0 || state.routes.length === 0) {
      return 0;
    }

    return (pillWidth - glassTabMotion.pillInset * 2) / state.routes.length;
  }, [pillWidth, state.routes.length]);

  const stopRunningAnimation = () => {
    if (runningAnimationRef.current) {
      runningAnimationRef.current.stop();
      runningAnimationRef.current = null;
    }
  };

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  const setVisualActiveIndexSafe = (index) => {
    if (visualActiveIndexRef.current === index) {
      return;
    }

    visualActiveIndexRef.current = index;
    setVisualActiveIndex(index);
  };

  const setBubbleFromLocation = (locationX) => {
    if (tabWidth <= 0) {
      return;
    }

    const maxX = Math.max(0, tabWidth * (state.routes.length - 1));
    const nextX = clamp(locationX - tabWidth / 2, 0, maxX);
    dragBubbleXRef.current = nextX;
    translateX.setValue(nextX);

    const nearestIndex = clamp(Math.round(nextX / tabWidth), 0, state.routes.length - 1);
    setVisualActiveIndexSafe(nearestIndex);
  };

  const anchorBubbleToIndex = (index, animated = true) => {
    if (tabWidth <= 0) {
      return;
    }

    const targetX = index * tabWidth;
    dragBubbleXRef.current = targetX;
    setVisualActiveIndexSafe(index);

    if (!animated) {
      translateX.setValue(targetX);
      return;
    }

    Animated.spring(translateX, {
      toValue: targetX,
      damping: 18,
      stiffness: 210,
      mass: 0.45,
      useNativeDriver: true,
    }).start();
  };

  const updatePillPageX = () => {
    if (
      !mainPillRef.current ||
      typeof mainPillRef.current.measureInWindow !== "function"
    ) {
      return;
    }

    mainPillRef.current.measureInWindow((pageX) => {
      pillPageXRef.current = pageX;
    });
  };

  const setBubbleFromGlobalX = (moveX) => {
    const localX = moveX - pillPageXRef.current;
    setBubbleFromLocation(localX);
  };

  const navigateToIndex = (index) => {
    const route = state.routes[index];
    if (!route) {
      return;
    }

    const isFocused = state.index === index;
    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_, gestureState) =>
          Math.abs(gestureState.dx) > DRAG_ACTIVATION_PX &&
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 1.2,
        onMoveShouldSetPanResponderCapture: (_, gestureState) =>
          Math.abs(gestureState.dx) > DRAG_ACTIVATION_PX &&
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 1.2,
        onPanResponderGrant: () => {
          if (tabWidth <= 0) {
            return;
          }

          updatePillPageX();
          isDraggingRef.current = true;
          stopRunningAnimation();
          dragBubbleXRef.current = activeIndexRef.current * tabWidth;

          const draggedIndex = Math.round(dragBubbleXRef.current / tabWidth);
          const hopDistance = Math.abs(draggedIndex - state.index);

          Animated.parallel([
            Animated.timing(bubbleScaleY, {
              toValue: glassTabMotion.activeBubbleFullHeightScale,
              duration: 90,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
            Animated.timing(bubbleScaleX, {
              toValue: Math.min(1.26, 1.14 + hopDistance * 0.06),
              duration: 90,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
          ]).start();
        },
        onPanResponderMove: (_, gestureState) => {
          setBubbleFromGlobalX(gestureState.moveX);
        },
        onPanResponderRelease: () => {
          if (tabWidth <= 0) {
            return;
          }

          const targetIndex = clamp(
            Math.round(dragBubbleXRef.current / tabWidth),
            0,
            state.routes.length - 1,
          );
          const targetX = targetIndex * tabWidth;

          isDraggingRef.current = false;

          Animated.parallel([
            Animated.timing(translateX, {
              toValue: targetX,
              duration: 120,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
            Animated.timing(bubbleScaleY, {
              toValue: 1,
              duration: 120,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
            Animated.timing(bubbleScaleX, {
              toValue: 1,
              duration: 120,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
          ]).start(() => {
            activeIndexRef.current = targetIndex;
            dragBubbleXRef.current = targetX;
            setVisualActiveIndexSafe(targetIndex);
          });

          navigateToIndex(targetIndex);
        },
        onPanResponderTerminate: () => {
          isDraggingRef.current = false;
          setVisualActiveIndexSafe(state.index);
          Animated.parallel([
            Animated.timing(bubbleScaleY, {
              toValue: 1,
              duration: 120,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
            Animated.timing(bubbleScaleX, {
              toValue: 1,
              duration: 120,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
          ]).start();
        },
      }),
    [
      bubbleScaleX,
      bubbleScaleY,
      navigation,
      state.index,
      state.routes,
      tabWidth,
      translateX,
    ],
  );

  const animateHoldStart = (index) => {
    if (tabWidth <= 0 || isDraggingRef.current) {
      return;
    }

    stopRunningAnimation();

    const targetX = index * tabWidth;
    const hopDistance = Math.abs(index - state.index);

    Animated.parallel([
      Animated.timing(translateX, {
        toValue: targetX,
        duration: 130,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(bubbleScaleY, {
        toValue: glassTabMotion.activeBubbleFullHeightScale,
        duration: 110,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(bubbleScaleX, {
        toValue: Math.min(1.26, 1.14 + hopDistance * 0.06),
        duration: 110,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateHoldEnd = () => {
    if (isDraggingRef.current) {
      return;
    }

    Animated.parallel([
      Animated.timing(bubbleScaleY, {
        toValue: 1,
        duration: 130,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(bubbleScaleX, {
        toValue: 1,
        duration: 130,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    if (tabWidth <= 0) {
      return;
    }

    const targetX = state.index * tabWidth;

    if (activeIndexRef.current === state.index) {
      translateX.setValue(targetX);
      dragBubbleXRef.current = targetX;
      setVisualActiveIndexSafe(state.index);
      return;
    }

    stopRunningAnimation();

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
      setVisualActiveIndexSafe(state.index);
      runningAnimationRef.current = null;
    });
  }, [bubbleScaleX, bubbleScaleY, state.index, tabWidth, translateX]);

  return (
    <View style={[elements.glassTabWrapper, { bottom: Math.max(insets.bottom, 10) }]}>
      <View
        ref={mainPillRef}
        style={elements.glassTabMainPill}
        onLayout={(event) => {
          setPillWidth(event.nativeEvent.layout.width);
          updatePillPageX();
        }}
        {...panResponder.panHandlers}
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
          const isFocused = visualActiveIndex === index;
          const Icon = ICONS[route.name] ?? Home;

          const onPress = () => {
            if (!isDraggingRef.current) {
              stopRunningAnimation();
              anchorBubbleToIndex(index, false);
            }

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
              onPressIn={() => animateHoldStart(index)}
              onPressOut={animateHoldEnd}
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

      {!sideActionConfig.hidden && (
        <Pressable
          style={elements.glassTabSideAction}
          onPress={onSideActionPress}
          disabled={sideActionConfig.disabled}
        >
          <BlurView
            intensity={colors.glassTab.blurSideIntensity}
            tint={colors.glassTab.blurTint}
            experimentalBlurMethod="dimezisBlurView"
            reducedTransparencyFallbackColor="rgba(10,12,16,0.58)"
            style={elements.glassTabSideActionBlur}
          />
          <View pointerEvents="none" style={elements.glassTabSideActionInnerBorder} />
          <SideActionIcon
            size={sideActionIconSize}
            strokeWidth={sideActionIconStrokeWidth}
            color={sideActionIconColor}
          />
        </Pressable>
      )}
    </View>
  );
}
