import { TouchableOpacity } from "react-native";

const variantStyles = {
  primary: { backgroundColor: "#F5A800", padding: 12, borderRadius: 14 },
  icon: {
    backgroundColor: "rgba(255,255,255,0.14)",
    borderRadius: 14,
    height: 44,
    width: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  ghost: { backgroundColor: "transparent", padding: 12, borderRadius: 14 },
  danger: {
    backgroundColor: "rgba(255,0,0,0.3)",
    padding: 12,
    borderRadius: 14,
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
