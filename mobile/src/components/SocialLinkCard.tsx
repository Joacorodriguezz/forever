import type { ComponentProps } from 'react';
import { Linking, Pressable, StyleSheet, Text } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { cardShadow } from '../utils/cardShadow';
import { COLORS } from '../constants/theme';

type FeatherIconName = ComponentProps<typeof Feather>['name'];

interface SocialLinkCardProps {
  label: string;
  url: string;
  iconFamily: 'feather' | 'fontawesome';
  iconName: FeatherIconName | ComponentProps<typeof FontAwesome>['name'];
  iconColor: string;
}

export function SocialLinkCard({
  label,
  url,
  iconFamily,
  iconName,
  iconColor,
}: SocialLinkCardProps) {
  const handlePress = () => {
    void Linking.openURL(url);
  };

  return (
    <Pressable
      style={styles.card}
      onPress={handlePress}
      accessibilityRole="link"
      accessibilityLabel={label}
    >
      {iconFamily === 'feather' ? (
        <Feather name={iconName as FeatherIconName} size={20} color={iconColor} />
      ) : (
        <FontAwesome name={iconName as ComponentProps<typeof FontAwesome>['name']} size={20} color={iconColor} />
      )}
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    height: 52,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...cardShadow,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.text,
  },
});
