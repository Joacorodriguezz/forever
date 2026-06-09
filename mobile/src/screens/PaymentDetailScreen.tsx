import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { pagoService } from '../services/pagoService';
import { cardShadow } from '../utils/cardShadow';
import { formatCurrency, formatDate, getMonthName } from '../utils/formatters';
import type { RootStackParamList } from '../navigation/types';
import type { Pago } from '../types/pago';

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentDetail'>;

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value?.trim() || '—'}</Text>
    </View>
  );
}

export function PaymentDetailScreen({ navigation, route }: Props) {
  const { pagoId } = route.params;
  const [loading, setLoading] = useState(true);
  const [pago, setPago] = useState<Pago | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await pagoService.getById(pagoId);
        if (!cancelled && res.success && res.data) {
          setPago(res.data);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pagoId]);

  const handleComprobante = async () => {
    if (!pago?.linkComprobante) {
      Alert.alert(
        'Comprobante no disponible',
        'El comprobante depende de la pasarela o del estado del pago.',
      );
      return;
    }
    await WebBrowser.openBrowserAsync(pago.linkComprobante);
  };

  const cuotaLabel = pago?.cuota
    ? `${getMonthName(pago.cuota.nroCuota)} ${pago.cuota.anio ?? ''}`.trim()
    : '—';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton} hitSlop={12}>
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Detalle del Pago</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#003366" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.card}>
            <Field label="Cuota" value={cuotaLabel} />
            <Field label="Monto" value={formatCurrency(Number(pago?.monto ?? 0))} />
            <Field
              label="Fecha"
              value={pago?.fechaPago ? formatDate(String(pago.fechaPago)) : undefined}
            />
            <Field label="Medio de pago" value={pago?.medioPago ?? 'Mercado Pago'} />
            <Field label="Estado" value={pago?.estadoPago} />
            <Field label="ID Mercado Pago" value={pago?.mercadoPagoId} />
          </View>

          {pago?.estadoPago === 'APROBADO' ? (
            <Pressable style={styles.button} onPress={() => void handleComprobante()}>
              <Text style={styles.buttonText}>Ver comprobante</Text>
            </Pressable>
          ) : null}
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
  backButton: { padding: 4, marginRight: 8 },
  backIcon: { color: '#FFF', fontSize: 28, fontWeight: '300' },
  headerTitle: { color: '#FFF', fontSize: 20, fontWeight: '700' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 16 },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...cardShadow,
  },
  field: { marginBottom: 12 },
  fieldLabel: { fontSize: 12, color: '#8A8F99', marginBottom: 2 },
  fieldValue: { fontSize: 16, color: '#1A1A1A', fontWeight: '600' },
  button: {
    backgroundColor: '#003366',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
