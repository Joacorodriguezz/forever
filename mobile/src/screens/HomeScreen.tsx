import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { AvisosBanner } from '../components/AvisosBanner';
import { HomeHeader } from '../components/HomeHeader';
import { MenuRow } from '../components/MenuRow';
import { SocialLinkCard } from '../components/SocialLinkCard';
import { cuotaService } from '../services/cuotaService';
import { deportistaService } from '../services/deportistaService';
import { showComingSoon } from '../utils/showComingSoon';
import type { MainTabParamList, RootStackParamList } from '../navigation/types';
import type { CuotaPendiente } from '../types/cuota';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function HomeScreen({ navigation }: Props) {
  const { user, logout } = useAuth();
  const [cuotasPendientes, setCuotasPendientes] = useState<CuotaPendiente[]>([]);
  const [disciplina, setDisciplina] = useState<string | undefined>();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [estadoRes, perfilRes] = await Promise.all([
          cuotaService.getMiEstado(),
          deportistaService.getMiPerfil(),
        ]);

        if (!cancelled && estadoRes.success && estadoRes.data) {
          const d = estadoRes.data;
          const pendientes = (d.cuotasPendientes || []).map((c) => ({
            id: c.id,
            nroCuota: c.nroCuota,
            anio: c.anio,
            monto: Number(c.monto),
            fechaVencimiento:
              typeof c.fechaVencimiento === 'string'
                ? c.fechaVencimiento
                : new Date(c.fechaVencimiento).toISOString().slice(0, 10),
            estadoCuota:
              c.estadoCuota === 'VENCIDA' ? ('VENCIDA' as const) : ('PENDIENTE' as const),
            disciplina: c.disciplina,
          }));
          setCuotasPendientes(pendientes);
        }

        if (!cancelled && perfilRes.success && perfilRes.data) {
          setDisciplina(perfilRes.data.disciplina?.nombre);
        }
      } catch {
        if (!cancelled) setCuotasPendientes([]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <HomeHeader
        nombre={user?.nombre}
        apellido={user?.apellido}
        disciplina={disciplina}
        onLogout={() => void logout()}
      />

      <View style={styles.body}>
        <AvisosBanner cuotasPendientes={cuotasPendientes} />

        <Text style={styles.sectionLabel}>Menú</Text>

        <MenuRow
          label="Estado de deuda"
          iconName="credit-card"
          iconColor="#003366"
          iconBg="#EEF2FF"
          onPress={() => navigation.navigate('Pagos')}
        />
        <MenuRow
          label="Historial de pagos"
          iconName="file-text"
          iconColor="#2E7D32"
          iconBg="#E8F5E9"
          onPress={() => navigation.navigate('PaymentHistory')}
        />
        <MenuRow
          label="Grupo familiar"
          iconName="users"
          iconColor="#E65100"
          iconBg="#FFF3E0"
          onPress={() => navigation.navigate('FamilyGroup')}
        />
        <MenuRow
          label="Noticias del club"
          iconName="book-open"
          iconColor="#6A1B9A"
          iconBg="#F3E5F5"
          onPress={() => navigation.navigate('Noticias')}
        />
        <MenuRow
          label="Mi perfil"
          iconName="user"
          iconColor="#1565C0"
          iconBg="#E3F2FD"
          onPress={() => navigation.navigate('Perfil')}
        />

        <Text style={styles.sectionLabel}>Redes del club</Text>

        <View style={styles.socialRow}>
          <SocialLinkCard
            label="WhatsApp"
            iconName="message-circle"
            iconColor="#25D366"
            onPress={showComingSoon}
          />
          <SocialLinkCard
            label="Instagram"
            iconName="instagram"
            iconColor="#E1306C"
            onPress={showComingSoon}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  body: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999999',
    letterSpacing: 1,
    marginTop: 4,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
  },
});
