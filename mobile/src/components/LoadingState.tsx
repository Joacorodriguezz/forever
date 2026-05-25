import type { ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/theme';

interface LoadingStateProps {
  message?: string;
  color?: string;
  backgroundColor?: string;
}

export function LoadingState({
  message = 'Cargando...',
  color = COLORS.primary,
  backgroundColor = COLORS.background,
}: LoadingStateProps) {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ActivityIndicator size="large" color={color} />
      <Text style={[styles.text, { color }]}>{message}</Text>
    </View>
  );
}

interface SectionLabelProps {
  children: ReactNode;
}

export function SectionLabel({ children }: SectionLabelProps) {
  return <Text style={styles.sectionLabel}>{children}</Text>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 24,
  },
  text: {
    fontSize: 14,
  },
  sectionLabel: {
    color: COLORS.textSubtle,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
  },
});
