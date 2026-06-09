import { StyleSheet, Text, View } from 'react-native';
import type { CuotaPendiente } from '../types/cuota';

type Props = {
  cuotasPendientes: CuotaPendiente[];
};

function daysUntil(dateString: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dateString);
  due.setHours(0, 0, 0, 0);
  return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function getAvisosFromCuotas(cuotas: CuotaPendiente[]): string[] {
  const avisos: string[] = [];

  const vencidas = cuotas.filter((c) => c.estadoCuota === 'VENCIDA');
  if (vencidas.length > 0) {
    avisos.push(
      vencidas.length === 1
        ? 'Tenés 1 cuota vencida. Regularizá tu situación.'
        : `Tenés ${vencidas.length} cuotas vencidas. Regularizá tu situación.`,
    );
  }

  const proximas = cuotas.filter((c) => {
    if (c.estadoCuota === 'VENCIDA') return false;
    const days = daysUntil(c.fechaVencimiento);
    return days >= 0 && days <= 7;
  });

  if (proximas.length > 0) {
    avisos.push(
      proximas.length === 1
        ? 'Tenés una cuota próxima a vencer en los próximos 7 días.'
        : `Tenés ${proximas.length} cuotas próximas a vencer en los próximos 7 días.`,
    );
  }

  return avisos;
}

export function AvisosBanner({ cuotasPendientes }: Props) {
  const avisos = getAvisosFromCuotas(cuotasPendientes);

  if (avisos.length === 0) return null;

  return (
    <View style={styles.container}>
      {avisos.map((aviso) => (
        <View key={aviso} style={styles.banner}>
          <Text style={styles.icon}>!</Text>
          <Text style={styles.text}>{aviso}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    marginBottom: 16,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF3D6',
    borderRadius: 10,
    padding: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  icon: {
    color: '#B45309',
    fontWeight: '700',
    fontSize: 14,
    marginTop: 1,
  },
  text: {
    flex: 1,
    color: '#92400E',
    fontSize: 13,
    lineHeight: 18,
  },
});
