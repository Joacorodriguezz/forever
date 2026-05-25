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
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { cardShadow } from '../utils/cardShadow';
import { cuotaService } from '../services/cuotaService';
import { grupoFamiliarService } from '../services/grupoFamiliarService';
import type { PagosStackParamList } from '../navigation/types';
import type { CuotaPendiente, DebtStatusData } from '../types/cuota';

type Props = NativeStackScreenProps<PagosStackParamList, 'DebtStatus'>;

const COLORS = {
  primary: '#003366',
  primaryDark: '#002244',
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
  infoBorder: '#CCD3E0',
  border: '#E0E4EA',
};

const MONTH_NAMES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

function getMonthName(monthNumber: number): string {
  if (monthNumber < 1 || monthNumber > 12) return `Cuota ${monthNumber}`;
  return MONTH_NAMES[monthNumber - 1];
}

function formatCurrency(amount: number): string {
  const formatted = new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
  return `$ ${formatted}`;
}

export function DebtStatusScreen({ navigation }: Props) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [debtData, setDebtData] = useState<DebtStatusData | null>(null);
  const [esTitular, setEsTitular] = useState(true);

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
            g.integrantes?.some((m) => m.deportista?.dni === dni)
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
          const d = res.data as {
            cuotasPendientes: Array<{
              id: number;
              nroCuota: number;
              monto: number | string;
              fechaVencimiento: string | Date;
              estadoCuota: string;
              disciplina?: string;
            }>;
            totalAdeudado: number | string;
          };

          const pendientes: CuotaPendiente[] = (d.cuotasPendientes || []).map((c) => ({
            id: c.id,
            nroCuota: c.nroCuota,
            monto: Number(c.monto),
            fechaVencimiento:
              typeof c.fechaVencimiento === 'string'
                ? c.fechaVencimiento
                : new Date(c.fechaVencimiento).toISOString().slice(0, 10),
            estadoCuota: c.estadoCuota === 'VENCIDA' ? 'VENCIDA' : 'PENDIENTE',
            disciplina: c.disciplina,
          }));

          setDebtData({
            cuotasPendientes: pendientes,
            totalAdeudado: Number(d.totalAdeudado) || 0,
          });
        } else {
          setDebtData({ cuotasPendientes: [], totalAdeudado: 0 });
        }
      } catch {
        if (!cancelled) setDebtData({ cuotasPendientes: [], totalAdeudado: 0 });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const handlePayMercadoPago = () => {
    Alert.alert(
      'Pagar con Mercado Pago',
      'La integración con Mercado Pago estará disponible próximamente.',
    );
  };

  const hasDebt = !!debtData && debtData.cuotasPendientes.length > 0;
  const cuotasCount = debtData?.cuotasPendientes.length ?? 0;
  const cuotasLabel = cuotasCount === 1 ? '1 cuota pendiente' : `${cuotasCount} cuotas pendientes`;
  const canGoBack = navigation.canGoBack();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {canGoBack ? (
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backIconButton}
            accessibilityRole="button"
            accessibilityLabel="Volver"
            hitSlop={12}
          >
            <Text style={styles.backIcon}>{'‹'}</Text>
          </Pressable>
        ) : (
          <View style={styles.backPlaceholder} />
        )}
        <Text style={[styles.headerTitle, !canGoBack && styles.headerTitleCentered]}>
          Estado de Deuda
        </Text>
        <View style={styles.backPlaceholder} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
      ) : (
        <>
          <View style={styles.summary}>
            <View style={[styles.statusBadge, hasDebt ? styles.statusBadgeDebt : styles.statusBadgePaid]}>
              <Text style={[styles.statusBadgeText, hasDebt ? styles.statusBadgeTextDebt : styles.statusBadgeTextPaid]}>
                {hasDebt ? 'Con deuda' : 'Al día'}
              </Text>
            </View>
            <Text style={styles.summaryAmount}>
              {formatCurrency(debtData?.totalAdeudado ?? 0)}
            </Text>
            <Text style={styles.summaryCaption}>
              {hasDebt
                ? `Total adeudado • ${cuotasLabel}`
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
                  <CuotaCard key={cuota.id} cuota={cuota} />
                ))}

                <View style={styles.infoBanner}>
                  <View style={styles.infoIcon}>
                    <Text style={styles.infoIconText}>i</Text>
                  </View>
                  <Text style={styles.infoText}>
                    El pago se procesa vía Mercado Pago. Los pagos grupales se acreditan al titular.
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
          </ScrollView>

          {hasDebt ? (
            <View style={styles.footer}>
              <Pressable
                style={[styles.payButton, !esTitular && styles.payButtonDisabled]}
                onPress={handlePayMercadoPago}
                disabled={!esTitular}
                accessibilityRole="button"
                accessibilityLabel="Pagar con Mercado Pago"
              >
                <Text style={styles.payButtonText}>Pagar con Mercado Pago</Text>
              </Pressable>
            </View>
          ) : null}
        </>
      )}
    </View>
  );
}

function CuotaCard({ cuota }: { cuota: CuotaPendiente }) {
  const year = new Date(cuota.fechaVencimiento).getFullYear();
  const monthLabel = `${getMonthName(cuota.nroCuota)} ${Number.isFinite(year) ? year : ''}`.trim();
  const subtitle = cuota.disciplina
    ? `Cuota mensual • ${cuota.disciplina}`
    : 'Cuota mensual';
  const isOverdue = cuota.estadoCuota === 'VENCIDA';

  return (
    <View style={styles.cuotaCard}>
      <View style={styles.cuotaInfo}>
        <Text style={styles.cuotaTitle}>{monthLabel}</Text>
        <Text style={styles.cuotaSubtitle}>{subtitle}</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 56,
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backIconButton: {
    padding: 4,
    width: 36,
  },
  backPlaceholder: {
    width: 36,
  },
  backIcon: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '300',
    lineHeight: 28,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
  },
  headerTitleCentered: {
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  summary: {
    backgroundColor: COLORS.primary,
    paddingTop: 8,
    paddingBottom: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 8,
  },
  statusBadgeDebt: {
    backgroundColor: COLORS.dangerBg,
  },
  statusBadgePaid: {
    backgroundColor: COLORS.successBg,
  },
  statusBadgeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusBadgeTextDebt: {
    color: COLORS.danger,
  },
  statusBadgeTextPaid: {
    color: COLORS.success,
  },
  summaryAmount: {
    color: '#FFFFFF',
    fontSize: 44,
    fontWeight: '700',
    marginBottom: 4,
  },
  summaryCaption: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    padding: 16,
    paddingBottom: 24,
  },
  sectionLabel: {
    color: COLORS.textSubtle,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 12,
  },
  cuotaCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...cardShadow,
  },
  cuotaInfo: {
    flex: 1,
    paddingRight: 12,
  },
  cuotaTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  cuotaSubtitle: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
  cuotaRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  cuotaAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.warning,
  },
  cuotaAmountOverdue: {
    color: COLORS.danger,
  },
  cuotaStatusPill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
  },
  cuotaStatusPending: {
    backgroundColor: COLORS.warningBg,
  },
  cuotaStatusOverdue: {
    backgroundColor: COLORS.dangerBg,
  },
  cuotaStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cuotaStatusTextPending: {
    color: '#B45309',
  },
  cuotaStatusTextOverdue: {
    color: COLORS.danger,
  },
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
  infoIconText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 16,
  },
  infoText: {
    flex: 1,
    color: COLORS.primary,
    fontSize: 13,
    lineHeight: 18,
  },
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
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.success,
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
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
  payButtonDisabled: {
    backgroundColor: '#6B7B8F',
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
