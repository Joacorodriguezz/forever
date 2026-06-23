import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { cardShadow } from '../utils/cardShadow';

type Props = {
  variant: 'empty' | 'error';
  message: string;
  onRetry?: () => void;
};

export function ScreenState({ variant, message, onRetry }: Props) {
  const iconName = variant === 'error' ? 'wifi-off' : 'inbox';

  return (
    <View style={styles.wrap}>
      <View style={styles.card}>
        <Feather name={iconName} size={40} color="#999999" />
        <Text style={styles.message}>{message}</Text>
        {variant === 'error' && onRetry ? (
          <Pressable style={styles.retryBtn} onPress={onRetry}>
            <Text style={styles.retryText}>Reintentar</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 16 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    gap: 12,
    ...cardShadow,
  },
  message: {
    color: '#666666',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  retryBtn: {
    minHeight: 48,
    minWidth: 120,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#003366',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
