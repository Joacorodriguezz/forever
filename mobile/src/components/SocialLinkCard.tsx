import { Pressable, StyleSheet, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { cardShadow } from '../utils/cardShadow';

type Props = {
  label: string;
  iconName: keyof typeof Feather.glyphMap;
  iconColor: string;
  onPress: () => void;
};

export function SocialLinkCard({ label, iconName, iconColor, onPress }: Props) {
  return (
    <Pressable
      style={styles.card}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Feather name={iconName} size={20} color={iconColor} />
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    ...cardShadow,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#0A0A0A',
  },
});
