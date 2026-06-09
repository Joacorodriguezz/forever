import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { deportistaService } from '../services/deportistaService';
import { cardShadow } from '../utils/cardShadow';
import type { MainTabParamList } from '../navigation/types';
import type { DeportistaProfile } from '../types/auth';

type Props = BottomTabScreenProps<MainTabParamList, 'Perfil'>;

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value?.trim() || '—'}</Text>
    </View>
  );
}

export function ProfileScreen(_props: Props) {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<DeportistaProfile | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await deportistaService.getMiPerfil();
        if (!cancelled && res.success && res.data) {
          setProfile(res.data);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.headerTitle}>Mi Perfil</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#003366" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Datos personales</Text>
            <Field label="Nombre" value={profile?.nombre} />
            <Field label="Apellido" value={profile?.apellido} />
            <Field label="DNI" value={profile?.dni} />
            <Field label="Email" value={profile?.cuenta?.email} />
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Datos deportivos</Text>
            <Field label="Disciplina" value={profile?.disciplina?.nombre} />
            <Field label="Género" value={profile?.genero?.nombre} />
            <Field label="Categoría" value={profile?.categoria?.nombre} />
            <Field label="Subcategoría" value={profile?.subcategoria?.nombre} />
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  header: {
    backgroundColor: '#003366',
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: { color: '#FFF', fontSize: 20, fontWeight: '700' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 16, gap: 16 },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    ...cardShadow,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#003366',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  field: { marginBottom: 12 },
  fieldLabel: { fontSize: 12, color: '#8A8F99', marginBottom: 2 },
  fieldValue: { fontSize: 16, color: '#1A1A1A', fontWeight: '600' },
});
