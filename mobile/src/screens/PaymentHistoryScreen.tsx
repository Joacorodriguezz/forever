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
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenState } from '../components/ScreenState';
import { deportistaService } from '../services/deportistaService';
import { cardShadow } from '../utils/cardShadow';
import { formatCurrency, formatDate, getMonthName } from '../utils/formatters';
import type { RootStackParamList } from '../navigation/types';
import type { HistorialPagoItem } from '../types/pago';

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentHistory'>;

type EstadoOperacion = 'APROBADA' | 'RECHAZADA' | 'PENDIENTE';

interface Operacion {
  id: number;
  fecha: string;
  mesCuota: number;
  anioCuota: number;
  monto: number;
  estado: EstadoOperacion;
}

const ESTADO_OPTIONS: { value: '' | EstadoOperacion; label: string }[] = [
  { value: '', label: 'Todos' },
  { value: 'APROBADA', label: 'Aprobada' },
  { value: 'RECHAZADA', label: 'Rechazada' },
  { value: 'PENDIENTE', label: 'Pendiente' },
];

function mapEstado(estado: string): EstadoOperacion {
  if (estado === 'APROBADO') return 'APROBADA';
  if (estado === 'RECHAZADO') return 'RECHAZADA';
  return 'PENDIENTE';
}

function parseHistorialPagos(pagos: HistorialPagoItem[]): Operacion[] {
  const ops: Operacion[] = pagos.map((p) => {
    const fechaStr =
      typeof p.fecha === 'string' ? p.fecha : new Date(p.fecha).toISOString().slice(0, 10);
    const d = new Date(p.fecha);
    const mesCuota = p.cuota?.nroCuota ?? d.getMonth() + 1;
    const anioCuota = p.cuota?.anio ?? d.getFullYear();
    return {
      id: p.id,
      fecha: fechaStr,
      mesCuota,
      anioCuota,
      monto: Number(p.monto),
      estado: mapEstado(p.estado),
    };
  });

  const dedup = new Map<string, Operacion>();
  for (const op of ops) {
    const key = `${op.mesCuota}-${op.anioCuota}`;
    const existing = dedup.get(key);
    if (!existing) {
      dedup.set(key, op);
    } else if (existing.estado !== 'APROBADA' && op.estado === 'APROBADA') {
      dedup.set(key, op);
    } else if (existing.fecha < op.fecha) {
      dedup.set(key, op);
    }
  }

  return Array.from(dedup.values()).sort((a, b) => {
    if (a.anioCuota !== b.anioCuota) return b.anioCuota - a.anioCuota;
    return b.mesCuota - a.mesCuota;
  });
}

export function PaymentHistoryScreen({ navigation }: Props) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [operaciones, setOperaciones] = useState<Operacion[]>([]);
  const [filtroAnio, setFiltroAnio] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<'' | EstadoOperacion>('');

  const fetchHistorial = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(false);

    try {
      const res = await deportistaService.getMiHistorial();
      if (res.success && res.data?.pagos) {
        setOperaciones(parseHistorialPagos(res.data.pagos));
      } else {
        setOperaciones([]);
      }
    } catch {
      setError(true);
      if (!isRefresh) setOperaciones([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void fetchHistorial();
  }, [fetchHistorial]);

  const aniosDisponibles = useMemo(() => {
    const anios = new Set(operaciones.map((o) => o.anioCuota));
    return Array.from(anios).sort((a, b) => b - a);
  }, [operaciones]);

  const filtradas = useMemo(
    () =>
      operaciones.filter((op) => {
        const cumpleAnio = !filtroAnio || String(op.anioCuota) === filtroAnio;
        const cumpleEstado = !filtroEstado || op.estado === filtroEstado;
        return cumpleAnio && cumpleEstado;
      }),
    [operaciones, filtroAnio, filtroEstado],
  );

  const emptyMessage =
    operaciones.length === 0
      ? 'No hay pagos registrados.'
      : 'No hay pagos para los filtros seleccionados.';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton} hitSlop={12}>
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Historial de Pagos</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#003366" />
        </View>
      ) : error ? (
        <ScreenState
          variant="error"
          message="No se pudo conectar con el servidor."
          onRetry={() => void fetchHistorial()}
        />
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => void fetchHistorial(true)}
              colors={['#003366']}
              tintColor="#003366"
            />
          }
        >
          <View style={styles.filters}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <Pressable
                style={[styles.chip, !filtroAnio && styles.chipActive]}
                onPress={() => setFiltroAnio('')}
              >
                <Text style={[styles.chipText, !filtroAnio && styles.chipTextActive]}>Todos</Text>
              </Pressable>
              {aniosDisponibles.map((anio) => (
                <Pressable
                  key={anio}
                  style={[styles.chip, filtroAnio === String(anio) && styles.chipActive]}
                  onPress={() => setFiltroAnio(String(anio))}
                >
                  <Text
                    style={[
                      styles.chipText,
                      filtroAnio === String(anio) && styles.chipTextActive,
                    ]}
                  >
                    {anio}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          <View style={styles.filters}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {ESTADO_OPTIONS.map((opt) => (
                <Pressable
                  key={opt.label}
                  style={[styles.chip, filtroEstado === opt.value && styles.chipActive]}
                  onPress={() => setFiltroEstado(opt.value)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      filtroEstado === opt.value && styles.chipTextActive,
                    ]}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {filtradas.length === 0 ? (
            <ScreenState variant="empty" message={emptyMessage} />
          ) : (
            <>
              <Text style={styles.sectionLabel}>OPERACIONES</Text>
              {filtradas.map((op) => (
                <Pressable
                  key={op.id}
                  style={styles.row}
                  onPress={() => navigation.navigate('PaymentDetail', { pagoId: op.id })}
                >
                  <View style={styles.rowLeft}>
                    <Text style={styles.rowTitle}>
                      {getMonthName(op.mesCuota)} {op.anioCuota}
                    </Text>
                    <Text style={styles.rowSub}>{formatDate(op.fecha)}</Text>
                  </View>
                  <View style={styles.rowRight}>
                    <Text style={styles.rowAmount}>{formatCurrency(op.monto)}</Text>
                    <View
                      style={[
                        styles.badge,
                        op.estado === 'APROBADA'
                          ? styles.badgeOk
                          : op.estado === 'RECHAZADA'
                            ? styles.badgeErr
                            : styles.badgePending,
                      ]}
                    >
                      <Text style={styles.badgeText}>{op.estado}</Text>
                    </View>
                  </View>
                </Pressable>
              ))}
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
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
  filters: { marginBottom: 8, paddingHorizontal: 16, paddingTop: 12 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#999999',
    letterSpacing: 1,
    marginHorizontal: 16,
    marginBottom: 8,
    marginTop: 4,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#E8ECF4',
    marginRight: 8,
    minHeight: 36,
    justifyContent: 'center',
  },
  chipActive: { backgroundColor: '#003366' },
  chipText: { color: '#003366', fontWeight: '600', fontSize: 14 },
  chipTextActive: { color: '#FFF' },
  row: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    ...cardShadow,
  },
  rowLeft: { flex: 1 },
  rowTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
  rowSub: { fontSize: 14, color: '#666', marginTop: 2 },
  rowRight: { alignItems: 'flex-end', gap: 6 },
  rowAmount: { fontSize: 15, fontWeight: '700', color: '#003366' },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  badgeOk: { backgroundColor: '#E5F4E6' },
  badgeErr: { backgroundColor: '#FDE7E7' },
  badgePending: { backgroundColor: '#FFF3D6' },
  badgeText: { fontSize: 11, fontWeight: '700', color: '#333' },
});
