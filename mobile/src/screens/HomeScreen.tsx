import { ScrollView, StyleSheet, View } from 'react-native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { HomeHeader } from '../components/HomeHeader';
import { MenuRow } from '../components/MenuRow';
import { SectionLabel } from '../components/LoadingState';
import { SocialLinkCard } from '../components/SocialLinkCard';
import { INSTAGRAM_URL, WHATSAPP_URL } from '../constants/socialLinks';
import { COLORS } from '../constants/theme';
import type { InicioStackParamList, MainTabParamList } from '../navigation/types';

type HomeNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<InicioStackParamList, 'Home'>,
  BottomTabNavigationProp<MainTabParamList>
>;

export function HomeScreen() {
  const navigation = useNavigation<HomeNavigationProp>();

  return (
    <View style={styles.container}>
      <HomeHeader />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SectionLabel>MENÚ</SectionLabel>

        <View style={styles.menuList}>
          <MenuRow
            label="Estado de deuda"
            icon="credit-card"
            iconBg={COLORS.iconBgDebt}
            iconColor={COLORS.iconDebt}
            onPress={() => navigation.navigate('Pagos', { screen: 'DebtStatus' })}
          />
          <MenuRow
            label="Historial de pagos"
            icon="file-text"
            iconBg={COLORS.iconBgHistory}
            iconColor={COLORS.iconHistory}
            onPress={() => navigation.navigate('Pagos', { screen: 'PaymentHistory' })}
          />
          <MenuRow
            label="Grupo familiar"
            icon="users"
            iconBg={COLORS.iconBgFamily}
            iconColor={COLORS.iconFamily}
            onPress={() => navigation.navigate('FamilyGroup')}
          />
          <MenuRow
            label="Noticias del club"
            icon="book-open"
            iconBg={COLORS.iconBgNews}
            iconColor={COLORS.iconNews}
            onPress={() => navigation.navigate('Noticias')}
          />
          <MenuRow
            label="Mi perfil"
            icon="user"
            iconBg={COLORS.iconBgProfile}
            iconColor={COLORS.iconProfile}
            onPress={() => navigation.navigate('Perfil')}
          />
        </View>

        <SectionLabel>REDES DEL CLUB</SectionLabel>

        <View style={styles.socialRow}>
          <SocialLinkCard
            label="WhatsApp"
            url={WHATSAPP_URL}
            iconFamily="feather"
            iconName="message-circle"
            iconColor={COLORS.whatsapp}
          />
          <SocialLinkCard
            label="Instagram"
            url={INSTAGRAM_URL}
            iconFamily="fontawesome"
            iconName="instagram"
            iconColor={COLORS.instagram}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
    gap: 12,
  },
  menuList: {
    gap: 12,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
  },
});
