import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenState } from '../components/ScreenState';
import { grupoFamiliarService, type GrupoFamiliarMio } from '../services/grupoFamiliarService';
import { cardShadow } from '../utils/cardShadow';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'FamilyGroup'>;

interface MiembroView {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  disciplina: string;
  categoria: string;
  esTitular: boolean;
  iniciales: string;
}

function getIniciales(nombre: string, apellido: string): string {
  const n = nombre.trim().charAt(0).toUpperCase();
  const a = apellido.trim().charAt(0).toUpperCase();
  return `${n}${a}` || '?';
}

function mapGrupo(grupo: GrupoFamiliarMio): MiembroView[] {
  const titularDni = grupo.titularDni ?? '';
  return (grupo.integrantes ?? [])
    .map((integrante) => {
      const d = integrante.deportista;
      if (!d?.id) return null;
      const nombre = d.nombre ?? '';
      const apellido = d.apellido ?? '';
      const dni = d.dni ?? '';
      const esTitular = Boolean(dni && (dni === titularDni || integrante.esPrincipal));
      return {
        id: d.id,
        nombre,
        apellido,
        dni,
        disciplina: d.disciplina?.nombre ?? '—',
        categoria: d.categoria?.nombre ?? '—',
        esTitular,
        iniciales: getIniciales(nombre, apellido),
      };
    })
    .filter((m): m is MiembroView => m !== null)
    .sort((a, b) => Number(b.esTitular) - Number(a.esTitular));
}

export function FamilyGroupScreen({ navigation }: Props) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [grupo, setGrupo] = useState<GrupoFamiliarMio | null>(null);

  const fetchGrupo = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(false);

    try {
      const res = await grupoFamiliarService.getMios();
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setGrupo(res.data[0] as GrupoFamiliarMio);
      } else {
        setGrupo(null);
      }
    } catch {
      setError(true);
      setGrupo(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void fetchGrupo();
  }, [fetchGrupo]);

  const miembros = useMemo(() => (grupo ? mapGrupo(grupo) : []), [grupo]);
  const countLabel = miembros.length === 1 ? '1 integrante' : `${miembros.length} integrantes`;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton} hitSlop={12}>
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Grupo Familiar</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#003366" />
        </View>
      ) : error ? (
        <ScreenState
          variant="error"
          message="No se pudo conectar con el servidor."
          onRetry={() => void fetchGrupo()}
        />
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => void fetchGrupo(true)}
              colors={['#003366']}
              tintColor="#003366"
            />
          }
        >
          {grupo ? (
            <>
              <View style={styles.summary}>
                <View style={styles.summaryIconWrap}>
                  <Feather name="users" size={26} color="#FFFFFF" />
                </View>
                <Text style={styles.grupoNombre}>{grupo.nombre ?? 'Grupo familiar'}</Text>
                <Text style={styles.grupoCount}>{countLabel}</Text>
              </View>

              <Text style={styles.sectionLabel}>INTEGRANTES</Text>
              {miembros.map((m) => (
                <View
                  key={m.id}
                  style={[styles.memberCard, m.esTitular && styles.memberCardTitular]}
                >
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{m.iniciales}</Text>
                  </View>
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>
                      {m.nombre} {m.apellido}
                    </Text>
                    <Text style={styles.memberDetail}>
                      {m.disciplina} • {m.categoria}
                    </Text>
                  </View>
                  <View style={[styles.roleBadge, m.esTitular ? styles.roleTitular : styles.roleMiembro]}>
                    <Text style={[styles.roleText, m.esTitular ? styles.roleTextTitular : styles.roleTextMiembro]}>
                      {m.esTitular ? 'Titular' : 'Miembro'}
                    </Text>
                  </View>
                </View>
              ))}
            </>
          ) : (
            <ScreenState
              variant="empty"
              message="No estás registrado en un grupo familiar. Para adherirte, contactate con el club."
            />
          )}

          <View style={styles.notice}>
            <Feather name="info" size={20} color="#003366" />
            <Text style={styles.noticeText}>
              Para adherir una persona al grupo familiar debe contactarse con algún dirigente del club.
            </Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: {
    backgroundColor: '#003366',
    paddingTop: 56,
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: { padding: 4, marginRight: 8, minWidth: 48, minHeight: 48, justifyContent: 'center' },
  backIcon: { color: '#FFF', fontSize: 28, fontWeight: '300' },
  headerTitle: { color: '#FFF', fontSize: 20, fontWeight: '700' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { paddingBottom: 32 },
  summary: {
    backgroundColor: '#003366',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    gap: 6,
  },
  summaryIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  grupoNombre: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  grupoCount: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#999999',
    letterSpacing: 1,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginHorizontal: 16,
    marginBottom: 10,
    gap: 12,
    ...cardShadow,
  },
  memberCardTitular: {
    borderWidth: 2,
    borderColor: '#003366',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#003366',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  memberInfo: { flex: 1 },
  memberName: { fontSize: 15, fontWeight: '600', color: '#0A0A0A' },
  memberDetail: { fontSize: 14, color: '#666666', marginTop: 2 },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    minHeight: 24,
    justifyContent: 'center',
  },
  roleTitular: { backgroundColor: '#003366' },
  roleMiembro: { backgroundColor: '#EEEEEE' },
  roleText: { fontSize: 11, fontWeight: '700' },
  roleTextTitular: { color: '#FFFFFF' },
  roleTextMiembro: { color: '#666666' },
  notice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 14,
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
  },
  noticeText: { flex: 1, fontSize: 14, color: '#333333', lineHeight: 20 },
});
