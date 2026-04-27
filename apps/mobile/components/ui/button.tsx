import React from "react";
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, StyleProp } from "react-native";

interface ButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary" | "outline" | "destructive";
  style?: StyleProp<ViewStyle>;
}

export function Button({ 
  onPress, 
  children, 
  disabled, 
  loading, 
  variant = "primary",
  style
}: ButtonProps) {
  const containerStyle = [
    styles.button,
    styles[variant],
    disabled && styles.disabled,
    style,
  ];

  const textStyle = [
    styles.text,
    variant === "outline" && styles.outlineText,
    disabled && styles.disabledText,
  ];

  return (
    <TouchableOpacity 
      style={containerStyle} 
      onPress={onPress} 
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={variant === "outline" ? "#000" : "#fff"} />
      ) : (
        <Text style={textStyle}>{children}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  primary: {
    backgroundColor: "#000",
  },
  secondary: {
    backgroundColor: "#f0f0f0",
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  destructive: {
    backgroundColor: "#ef4444",
  },
  disabled: {
    backgroundColor: "#ccc",
    borderColor: "#ccc",
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  outlineText: {
    color: "#000",
  },
  disabledText: {
    color: "#999",
  },
});
