import { TouchableOpacity } from "react-native";
import { elements, size as sizeStyles } from "../theme";

const variantStyles = {
  primary: elements.buttonPrimary,
  icon: elements.buttonIcon,
  ghost: elements.buttonGhost,
  danger: elements.buttonDanger,
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
