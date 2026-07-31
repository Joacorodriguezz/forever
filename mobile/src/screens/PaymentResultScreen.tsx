import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { pagoService } from '../services/pagoService';
import { formatCurrency } from '../utils/formatters';
import type { RootStackParamList } from '../navigation/types';
import type { Pago } from '../types/pago';

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentResult'>;

const STATUS_CONFIG = {
  APROBADO: {
    title: 'Pago aprobado',
    message: 'Tu pago fue acreditado correctamente.',
    color: '#2E7D32',
    bg: '#E5F4E6',
  },
  PENDIENTE: {
    title: 'Pago pendiente',
    message: 'Tu pago está en proceso de confirmación.',
    color: '#B45309',
    bg: '#FFF3D6',
  },
  RECHAZADO: {
    title: 'Pago rechazado',
    message: 'No se pudo completar el pago. Intentá nuevamente.',
    color: '#E53935',
    bg: '#FDE7E7',
  },
  ERROR: {
    title: 'Error de conexión',
    message: 'No se pudo verificar el estado del pago. Revisá tu conexión.',
    color: '#E53935',
    bg: '#FDE7E7',
  },
} as const;

export function PaymentResultScreen({ navigation, route }: Props) {
  const pagoId = Number(route.params.pagoId);
  const paymentId = route.params.paymentId;
  const [loading, setLoading] = useState(true);
  const [pago, setPago] = useState<Pago | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;
    let synced = false;

    const poll = async () => {
      if (!pagoId || Number.isNaN(pagoId)) {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        if (paymentId && !synced) {
          synced = true;
          await pagoService.sincronizar(pagoId, paymentId);
        }

        const res = await pagoService.getById(pagoId);
        if (cancelled) return;

        if (res.success && res.data) {
          setPago(res.data);
          if (res.data.estadoPago === 'PENDIENTE' && attempts < 5) {
            attempts += 1;
            setTimeout(() => void poll(), 2000);
          }
        } else {
          setError(true);
        }
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void poll();

    return () => {
      cancelled = true;
    };
  }, [pagoId, paymentId]);

  const estadoKey = error
    ? 'ERROR'
    : (pago?.estadoPago as keyof typeof STATUS_CONFIG) ?? 'PENDIENTE';
  const config = STATUS_CONFIG[estadoKey] ?? STATUS_CONFIG.PENDIENTE;

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#003366" />
          <Text style={styles.loadingText}>Verificando pago...</Text>
        </View>
      ) : (
        <View style={styles.content}>
          <View style={[styles.badge, { backgroundColor: config.bg }]}>
            <Text style={[styles.badgeTitle, { color: config.color }]}>{config.title}</Text>
            <Text style={styles.badgeMessage}>{config.message}</Text>
            {pago ? (
              <Text style={styles.amount}>{formatCurrency(Number(pago.monto))}</Text>
            ) : null}
          </View>

          <Pressable
            style={styles.primaryButton}
            onPress={() => navigation.navigate('MainTabs', { screen: 'Home' })}
          >
            <Text style={styles.primaryButtonText}>Volver al inicio</Text>
          </Pressable>

          {pago?.estadoPago === 'APROBADO' ? (
            <Pressable
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('PaymentDetail', { pagoId })}
            >
              <Text style={styles.secondaryButtonText}>Ver comprobante</Text>
            </Pressable>
          ) : null}

          <Pressable
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('PaymentHistory')}
          >
            <Text style={styles.secondaryButtonText}>Ver historial</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { color: '#666', fontSize: 14 },
  content: { flex: 1, padding: 24, justifyContent: 'center', gap: 12 },
  badge: {
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  badgeTitle: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  badgeMessage: { fontSize: 14, color: '#444', textAlign: 'center', marginBottom: 8 },
  amount: { fontSize: 28, fontWeight: '700', color: '#003366' },
  primaryButton: {
    backgroundColor: '#003366',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#003366',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButtonText: { color: '#003366', fontSize: 16, fontWeight: '600' },
});
