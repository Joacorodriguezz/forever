import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { cardShadow } from '../utils/cardShadow';
import { COLORS } from '../constants/theme';

type FeatherIconName = ComponentProps<typeof Feather>['name'];

interface MenuRowProps {
  label: string;
  icon: FeatherIconName;
  iconBg: string;
  iconColor: string;
  onPress: () => void;
}

export function MenuRow({ label, icon, iconBg, iconColor, onPress }: MenuRowProps) {
  return (
    <Pressable
      style={styles.row}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
        <Feather name={icon} size={20} color={iconColor} />
      </View>
      <Text style={styles.label}>{label}</Text>
      <Feather name="chevron-right" size={18} color={COLORS.textSubtle} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    height: 56,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...cardShadow,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.text,
  },
});
