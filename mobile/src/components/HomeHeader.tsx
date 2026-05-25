import { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import { useAuth } from '../context/AuthContext';
import { deportistaService } from '../services/deportistaService';
import { COLORS, GRADIENT } from '../constants/theme';

function getDisciplinaNombre(disciplina: unknown): string | null {
  if (!disciplina) return null;
  if (typeof disciplina === 'string') return disciplina;
  if (typeof disciplina === 'object' && disciplina !== null && 'nombre' in disciplina) {
    const nombre = (disciplina as { nombre?: string }).nombre;
    return nombre?.trim() || null;
  }
  return null;
}

export function HomeHeader() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const [disciplina, setDisciplina] = useState<string | null>(null);

  const greetingName = user?.nombre?.trim() || user?.loginId || '';

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await deportistaService.getMiPerfil();
        if (cancelled || !res.success || !res.data) return;
        setDisciplina(getDisciplinaNombre(res.data.disciplina));
      } catch {
        if (!cancelled) setDisciplina(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const roleLabel = disciplina ? `Deportista • ${disciplina}` : 'Deportista';

  return (
    <LinearGradient
      colors={[...GRADIENT]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <View style={styles.topRow}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>FE</Text>
        </View>
        <View style={styles.topRight}>
          <Text style={styles.greeting}>Hola{greetingName ? `, ${greetingName}` : ''}</Text>
          <Pressable
            onPress={() => void logout()}
            style={styles.logoutButton}
            accessibilityRole="button"
            accessibilityLabel="Cerrar sesión"
            hitSlop={8}
          >
            <Feather name="log-out" size={22} color="rgba(255,255,255,0.7)" />
          </Pressable>
        </View>
      </View>

      <View style={styles.welcomeBlock}>
        <Text style={styles.welcomeTitle}>Bienvenido al club</Text>
        <Text style={styles.welcomeSubtitle}>{roleLabel}</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  topRow: {
    height: 64,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  topRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  greeting: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  logoutButton: {
    padding: 4,
  },
  welcomeBlock: {
    paddingHorizontal: 16,
    gap: 4,
  },
  welcomeTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  welcomeSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
  },
});
