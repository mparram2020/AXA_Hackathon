import React from 'react';
import { StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { IconSymbol } from './IconSymbol';

interface IconButtonProps {
  name: string;
  size: number;
  color?: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

export function IconButton({
  name,
  size,
  color = '#1F448C',
  onPress,
  style,
  disabled = false,
}: IconButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <IconSymbol name={name} size={size} color={disabled ? '#CCCCCC' : color} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});