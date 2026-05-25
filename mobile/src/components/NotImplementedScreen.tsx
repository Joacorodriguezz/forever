import { StyleSheet, Text, View } from 'react-native';
import { ScreenHeader } from './ScreenHeader';
import { COLORS } from '../constants/theme';

interface NotImplementedScreenProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
}

export function NotImplementedScreen({
  title,
  showBack = false,
  onBack,
}: NotImplementedScreenProps) {
  return (
    <View style={styles.container}>
      <ScreenHeader title={title} showBack={showBack} onBack={onBack} />

      <View style={styles.content}>
        <Text style={styles.message}>Todavía no implementado</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  message: {
    fontSize: 16,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});
