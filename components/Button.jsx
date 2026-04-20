import { TouchableOpacity } from "react-native";
import { colors } from "../theme";

const variantStyles = {
  primary: {
    backgroundColor: colors.button.backgroundColor,
    borderColor: colors.button.borderColor,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  icon: {
    backgroundColor: colors.button.backgroundColor,
    borderColor: colors.button.borderColor,
    borderRadius: 14,
    height: 44,
    width: 44,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  ghost: { backgroundColor: "transparent", padding: 12, borderRadius: 14 },
  danger: {
    backgroundColor: "rgba(255,0,0,0.3)",
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 0, 0, 0.56)",
  },
};

const sizeStyles = {
  sm: { padding: 6 },
  md: { padding: 12 },
  lg: { padding: 16 },
};

export const Button = ({
  children,
  onPress,
  style,
  variant = "primary",
  size = "md",
}) => {
  return (
    <TouchableOpacity
      style={[variantStyles[variant], sizeStyles[size], style]}
      onPress={onPress}
    >
      {children}
    </TouchableOpacity>
  );
};
