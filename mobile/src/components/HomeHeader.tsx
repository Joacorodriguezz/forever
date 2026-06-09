import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

type Props = {
  nombre?: string;
  apellido?: string;
  disciplina?: string;
  onLogout: () => void;
};

function getInitials(nombre?: string, apellido?: string): string {
  const n = nombre?.trim()?.[0]?.toUpperCase();
  const a = apellido?.trim()?.[0]?.toUpperCase();
  if (n && a) return `${n}${a}`;
  if (n) return n;
  return 'FE';
}

export function HomeHeader({ nombre, apellido, disciplina, onLogout }: Props) {
  const insets = useSafeAreaInsets();
  const greetingName = nombre?.trim() || 'deportista';
  const subtitle = disciplina?.trim()
    ? `Deportista • ${disciplina.trim()}`
    : 'Deportista';

  return (
    <LinearGradient
      colors={['#002244', '#003366', '#004080']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.gradient, { paddingTop: insets.top + 8 }]}
    >
      <View style={styles.headerRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(nombre, apellido)}</Text>
        </View>

        <View style={styles.headerRight}>
          <Text style={styles.greeting}>Hola, {greetingName}</Text>
          <Pressable
            onPress={onLogout}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Cerrar sesión"
          >
            <Feather name="log-out" size={22} color="rgba(255,255,255,0.7)" />
          </Pressable>
        </View>
      </View>

      <View style={styles.greetCard}>
        <Text style={styles.greetTitle}>Bienvenido al club</Text>
        <Text style={styles.greetSub}>{subtitle}</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    paddingBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 64,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#003366',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  greeting: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  greetCard: {
    paddingHorizontal: 16,
    gap: 4,
  },
  greetTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  greetSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
});
