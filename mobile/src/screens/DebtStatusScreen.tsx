import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { cardShadow } from '../utils/cardShadow';
import { cuotaService } from '../services/cuotaService';
import { grupoFamiliarService } from '../services/grupoFamiliarService';
import { pagoService } from '../services/pagoService';
import { formatCurrency, formatDate, getMonthName } from '../utils/formatters';
import type { MainTabParamList, RootStackParamList } from '../navigation/types';
import type { CuotaPagada, CuotaPendiente, DebtStatusData } from '../types/cuota';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Pagos'>,
  NativeStackScreenProps<RootStackParamList>
>;

const COLORS = {
  primary: '#003366',
  background: '#F5F7FA',
  surface: '#FFFFFF',
  text: '#1A1A1A',
  textMuted: '#666666',
  textSubtle: '#8A8F99',
  danger: '#E53935',
  dangerBg: '#FDE7E7',
  warning: '#F59E0B',
  warningBg: '#FFF3D6',
  success: '#2E7D32',
  successBg: '#E5F4E6',
  infoBg: '#E8ECF4',
  border: '#E0E4EA',
  selectedBorder: '#003366',
};

export function DebtStatusScreen({ navigation }: Props) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [debtData, setDebtData] = useState<DebtStatusData | null>(null);
  const [esTitular, setEsTitular] = useState(true);
  const [selectedCuotaId, setSelectedCuotaId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const dni = user?.loginId;
      if (!dni) return;
      try {
        const resGrupos = await grupoFamiliarService.getMios();
        if (cancelled) return;
        if (resGrupos.success && Array.isArray(resGrupos.data)) {
          const grupos = resGrupos.data;
          const grupo = grupos.find((g) =>
            g.integrantes?.some((m) => m.deportista?.dni === dni),
          );
          const titularDni = grupo?.titularDni ?? grupo?.integrantes?.[0]?.deportista?.dni;
          setEsTitular(!grupo || titularDni === dni);
        }
      } catch {
        setEsTitular(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.loginId]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await cuotaService.getMiEstado();
        if (cancelled) return;
        if (res.success && res.data) {
          const d = res.data;

          const pendientes: CuotaPendiente[] = (d.cuotasPendientes || []).map((c) => ({
            id: c.id,
            nroCuota: c.nroCuota,
            anio: c.anio,
            monto: Number(c.monto),
            fechaVencimiento:
              typeof c.fechaVencimiento === 'string'
                ? c.fechaVencimiento
                : new Date(c.fechaVencimiento).toISOString().slice(0, 10),
            estadoCuota: c.estadoCuota === 'VENCIDA' ? 'VENCIDA' : 'PENDIENTE',
            disciplina: c.disciplina,
          }));

          const pagadas: CuotaPagada[] = (d.cuotasPagadas || []).map((c) => ({
            id: c.id,
            nroCuota: c.nroCuota,
            anio: c.anio,
            monto: Number(c.monto),
            fechaPago: c.fechaPago
              ? typeof c.fechaPago === 'string'
                ? c.fechaPago
                : new Date(c.fechaPago).toISOString().slice(0, 10)
              : undefined,
            medioPago: c.medioPago ?? undefined,
            disciplina: c.disciplina,
          }));

          setDebtData({
            cuotasPendientes: pendientes,
            cuotasPagadas: pagadas,
            totalAdeudado: Number(d.totalAdeudado) || 0,
          });

          if (pendientes.length === 1) {
            setSelectedCuotaId(pendientes[0].id);
          }
        } else {
          setDebtData({ cuotasPendientes: [], cuotasPagadas: [], totalAdeudado: 0 });
        }
      } catch {
        if (!cancelled) {
          setDebtData({ cuotasPendientes: [], cuotasPagadas: [], totalAdeudado: 0 });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const selectedCuota = debtData?.cuotasPendientes.find((c) => c.id === selectedCuotaId);
  const selectedAmount = selectedCuota ? selectedCuota.monto : 0;

  const handlePayMercadoPago = async () => {
    if (!selectedCuotaId) {
      Alert.alert('Seleccioná una cuota', 'Elegí la cuota que querés pagar.');
      return;
    }

    if (!esTitular) {
      Alert.alert('Pago no permitido', 'Solo el titular del grupo familiar puede realizar el pago.');
      return;
    }

    setPaying(true);
    try {
      const res = await pagoService.crear(selectedCuotaId);
      if (!res.success || !res.data?.checkoutUrl) {
        Alert.alert('Error', res.error ?? 'No se pudo iniciar el pago.');
        return;
      }

      const pagoId = res.data.pago.id;
      const canOpenCheckout = await Linking.canOpenURL(res.data.checkoutUrl);

      if (canOpenCheckout) {
        await Linking.openURL(res.data.checkoutUrl);
      } else {
        const result = await WebBrowser.openBrowserAsync(res.data.checkoutUrl);
        if (result.type === 'cancel' || result.type === 'dismiss') {
          navigation.navigate('PaymentResult', { pagoId });
        }
      }
    } catch (error: any) {
      const serverMessage = error?.response?.data?.error;
      if (serverMessage) {
        Alert.alert('No se pudo iniciar el pago', serverMessage);
      } else {
        Alert.alert(
          'Sin conexión',
          'No se pudo conectar con el servidor. Verificá tu internet e intentá de nuevo.',
        );
      }
    } finally {
      setPaying(false);
    }
  };

  const hasDebt = !!debtData && debtData.cuotasPendientes.length > 0;
  const cuotasCount = debtData?.cuotasPendientes.length ?? 0;
  const cuotasLabel = cuotasCount === 1 ? '1 cuota pendiente' : `${cuotasCount} cuotas pendientes`;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.navigate('Home')}
          style={styles.backIconButton}
          accessibilityRole="button"
          accessibilityLabel="Volver"
          hitSlop={12}
        >
          <Text style={styles.backIcon}>{'‹'}</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Estado de Deuda</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
      ) : (
        <>
          <View style={styles.summary}>
            <View
              style={[
                styles.statusBadge,
                hasDebt ? styles.statusBadgeDebt : styles.statusBadgePaid,
              ]}
            >
              <Text
                style={[
                  styles.statusBadgeText,
                  hasDebt ? styles.statusBadgeTextDebt : styles.statusBadgeTextPaid,
                ]}
              >
                {hasDebt ? 'Con deuda' : 'Al día'}
              </Text>
            </View>
            <Text style={styles.summaryAmount}>
              {formatCurrency(hasDebt && selectedCuota ? selectedAmount : debtData?.totalAdeudado ?? 0)}
            </Text>
            <Text style={styles.summaryCaption}>
              {hasDebt
                ? selectedCuota
                  ? `Monto seleccionado • ${cuotasLabel}`
                  : `Seleccioná una cuota • ${cuotasLabel}`
                : 'No tenés cuotas pendientes'}
            </Text>
          </View>

          <ScrollView
            style={styles.body}
            contentContainerStyle={styles.bodyContent}
            showsVerticalScrollIndicator={false}
          >
            {hasDebt ? (
              <>
                <Text style={styles.sectionLabel}>CUOTAS PENDIENTES</Text>
                {debtData!.cuotasPendientes.map((cuota) => (
                  <CuotaCard
                    key={cuota.id}
                    cuota={cuota}
                    selected={selectedCuotaId === cuota.id}
                    onSelect={() => setSelectedCuotaId(cuota.id)}
                  />
                ))}

                <View style={styles.infoBanner}>
                  <View style={styles.infoIcon}>
                    <Text style={styles.infoIconText}>i</Text>
                  </View>
                  <Text style={styles.infoText}>
                    Seleccioná una cuota y pagá con Mercado Pago. Los pagos grupales se acreditan al titular.
                  </Text>
                </View>

                {!esTitular ? (
                  <Text style={styles.titularNotice}>
                    Solo el titular del grupo familiar puede realizar el pago.
                  </Text>
                ) : null}
              </>
            ) : (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyTitle}>¡Felicitaciones!</Text>
                <Text style={styles.emptyText}>No tenés cuotas pendientes de pago.</Text>
              </View>
            )}

            {debtData && debtData.cuotasPagadas.length > 0 ? (
              <>
                <Text style={[styles.sectionLabel, styles.sectionSpacing]}>CUOTAS PAGADAS</Text>
                {debtData.cuotasPagadas.map((cuota) => (
                  <CuotaPagadaCard key={cuota.id} cuota={cuota} />
                ))}
              </>
            ) : null}
          </ScrollView>

          {hasDebt ? (
            <View style={styles.footer}>
              <Pressable
                style={[
                  styles.payButton,
                  (!esTitular || !selectedCuotaId || paying) && styles.payButtonDisabled,
                ]}
                onPress={() => void handlePayMercadoPago()}
                disabled={!esTitular || !selectedCuotaId || paying}
                accessibilityRole="button"
                accessibilityLabel="Pagar con Mercado Pago"
              >
                <Text style={styles.payButtonText}>
                  {paying
                    ? 'Procesando...'
                    : selectedCuota
                      ? `Pagar ${formatCurrency(selectedAmount)} con Mercado Pago`
                      : 'Pagar con Mercado Pago'}
                </Text>
              </Pressable>
            </View>
          ) : null}
        </>
      )}
    </View>
  );
}

function CuotaCard({
  cuota,
  selected,
  onSelect,
}: {
  cuota: CuotaPendiente;
  selected: boolean;
  onSelect: () => void;
}) {
  const year = cuota.anio ?? new Date(cuota.fechaVencimiento).getFullYear();
  const monthLabel = `${getMonthName(cuota.nroCuota)} ${Number.isFinite(year) ? year : ''}`.trim();
  const subtitle = cuota.disciplina
    ? `Cuota mensual • ${cuota.disciplina}`
    : 'Cuota mensual';
  const isOverdue = cuota.estadoCuota === 'VENCIDA';

  return (
    <Pressable
      style={[styles.cuotaCard, selected && styles.cuotaCardSelected]}
      onPress={onSelect}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
    >
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected ? <View style={styles.radioDot} /> : null}
      </View>
      <View style={styles.cuotaInfo}>
        <Text style={styles.cuotaTitle}>{monthLabel}</Text>
        <Text style={styles.cuotaSubtitle}>{subtitle}</Text>
        <Text style={styles.cuotaVence}>Vence: {formatDate(cuota.fechaVencimiento)}</Text>
      </View>
      <View style={styles.cuotaRight}>
        <Text style={[styles.cuotaAmount, isOverdue ? styles.cuotaAmountOverdue : null]}>
          {formatCurrency(Number(cuota.monto))}
        </Text>
        <View
          style={[
            styles.cuotaStatusPill,
            isOverdue ? styles.cuotaStatusOverdue : styles.cuotaStatusPending,
          ]}
        >
          <Text
            style={[
              styles.cuotaStatusText,
              isOverdue ? styles.cuotaStatusTextOverdue : styles.cuotaStatusTextPending,
            ]}
          >
            {isOverdue ? 'Vencida' : 'Pendiente'}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

function CuotaPagadaCard({ cuota }: { cuota: CuotaPagada }) {
  const year = cuota.anio ?? (cuota.fechaPago ? new Date(cuota.fechaPago).getFullYear() : '');
  const monthLabel = `${getMonthName(cuota.nroCuota)} ${year}`.trim();

  return (
    <View style={styles.cuotaCard}>
      <View style={styles.cuotaInfo}>
        <Text style={styles.cuotaTitle}>{monthLabel}</Text>
        <Text style={styles.cuotaSubtitle}>
          {cuota.disciplina ? `Cuota mensual • ${cuota.disciplina}` : 'Cuota mensual'}
        </Text>
        {cuota.fechaPago ? (
          <Text style={styles.cuotaVence}>Pagada: {formatDate(cuota.fechaPago)}</Text>
        ) : null}
      </View>
      <View style={styles.cuotaRight}>
        <Text style={[styles.cuotaAmount, styles.cuotaAmountPaid]}>
          {formatCurrency(Number(cuota.monto))}
        </Text>
        <View style={[styles.cuotaStatusPill, styles.cuotaStatusPaid]}>
          <Text style={[styles.cuotaStatusText, styles.cuotaStatusTextPaid]}>Pagada</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 56,
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIconButton: { padding: 4, marginRight: 8 },
  backIcon: { color: '#FFFFFF', fontSize: 28, fontWeight: '300', lineHeight: 28 },
  headerTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: { color: '#FFFFFF', fontSize: 14 },
  summary: {
    backgroundColor: COLORS.primary,
    paddingTop: 8,
    paddingBottom: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  statusBadge: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 999, marginBottom: 8 },
  statusBadgeDebt: { backgroundColor: COLORS.dangerBg },
  statusBadgePaid: { backgroundColor: COLORS.successBg },
  statusBadgeText: { fontSize: 14, fontWeight: '600' },
  statusBadgeTextDebt: { color: COLORS.danger },
  statusBadgeTextPaid: { color: COLORS.success },
  summaryAmount: { color: '#FFFFFF', fontSize: 44, fontWeight: '700', marginBottom: 4 },
  summaryCaption: { color: 'rgba(255,255,255,0.85)', fontSize: 14 },
  body: { flex: 1 },
  bodyContent: { padding: 16, paddingBottom: 24 },
  sectionLabel: {
    color: COLORS.textSubtle,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 12,
  },
  sectionSpacing: { marginTop: 20 },
  cuotaCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    ...cardShadow,
  },
  cuotaCardSelected: { borderColor: COLORS.selectedBorder },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#CCD3E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioSelected: { borderColor: COLORS.primary },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.primary },
  cuotaInfo: { flex: 1, paddingRight: 8 },
  cuotaTitle: { color: COLORS.text, fontSize: 16, fontWeight: '700', marginBottom: 2 },
  cuotaSubtitle: { color: COLORS.textMuted, fontSize: 13 },
  cuotaVence: { color: COLORS.textSubtle, fontSize: 12, marginTop: 4 },
  cuotaRight: { alignItems: 'flex-end', gap: 6 },
  cuotaAmount: { fontSize: 16, fontWeight: '700', color: COLORS.warning },
  cuotaAmountOverdue: { color: COLORS.danger },
  cuotaAmountPaid: { color: COLORS.success },
  cuotaStatusPill: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999 },
  cuotaStatusPending: { backgroundColor: COLORS.warningBg },
  cuotaStatusOverdue: { backgroundColor: COLORS.dangerBg },
  cuotaStatusPaid: { backgroundColor: COLORS.successBg },
  cuotaStatusText: { fontSize: 12, fontWeight: '600' },
  cuotaStatusTextPending: { color: '#B45309' },
  cuotaStatusTextOverdue: { color: COLORS.danger },
  cuotaStatusTextPaid: { color: COLORS.success },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.infoBg,
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
    gap: 10,
  },
  infoIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  infoIconText: { color: COLORS.primary, fontSize: 13, fontWeight: '700', lineHeight: 16 },
  infoText: { flex: 1, color: COLORS.primary, fontSize: 13, lineHeight: 18 },
  titularNotice: {
    color: COLORS.danger,
    fontSize: 13,
    marginTop: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  emptyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    ...cardShadow,
  },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: COLORS.success, marginBottom: 6 },
  emptyText: { fontSize: 14, color: COLORS.textMuted, textAlign: 'center' },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
    backgroundColor: COLORS.background,
  },
  payButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  payButtonDisabled: { backgroundColor: '#6B7B8F' },
  payButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700', textAlign: 'center' },
});
