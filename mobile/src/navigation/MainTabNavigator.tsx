import { StyleSheet, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Feather from '@expo/vector-icons/Feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeScreen } from '../screens/HomeScreen';
import { DebtStatusScreen } from '../screens/DebtStatusScreen';
import { PaymentHistoryScreen } from '../screens/PaymentHistoryScreen';
import { FamilyGroupScreen } from '../screens/FamilyGroupScreen';
import { NewsScreen } from '../screens/NewsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { COLORS } from '../constants/theme';
import type {
  InicioStackParamList,
  MainTabParamList,
  NoticiasStackParamList,
  PagosStackParamList,
  PerfilStackParamList,
} from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();
const InicioStack = createNativeStackNavigator<InicioStackParamList>();
const PagosStack = createNativeStackNavigator<PagosStackParamList>();
const NoticiasStack = createNativeStackNavigator<NoticiasStackParamList>();
const PerfilStack = createNativeStackNavigator<PerfilStackParamList>();

type TabIconName = 'home' | 'credit-card' | 'file-text' | 'user';

function TabIcon({ name, focused }: { name: TabIconName; focused: boolean }) {
  const color = focused ? COLORS.primary : COLORS.textSubtle;
  return <Feather name={name} size={24} color={color} />;
}

function InicioNavigator() {
  return (
    <InicioStack.Navigator screenOptions={{ headerShown: false }}>
      <InicioStack.Screen name="Home" component={HomeScreen} />
      <InicioStack.Screen name="FamilyGroup" component={FamilyGroupScreen} />
    </InicioStack.Navigator>
  );
}

function PagosNavigator() {
  return (
    <PagosStack.Navigator screenOptions={{ headerShown: false }}>
      <PagosStack.Screen name="DebtStatus" component={DebtStatusScreen} />
      <PagosStack.Screen name="PaymentHistory" component={PaymentHistoryScreen} />
    </PagosStack.Navigator>
  );
}

function NoticiasNavigator() {
  return (
    <NoticiasStack.Navigator screenOptions={{ headerShown: false }}>
      <NoticiasStack.Screen name="News" component={NewsScreen} />
    </NoticiasStack.Navigator>
  );
}

function PerfilNavigator() {
  return (
    <PerfilStack.Navigator screenOptions={{ headerShown: false }}>
      <PerfilStack.Screen name="Profile" component={ProfileScreen} />
    </PerfilStack.Navigator>
  );
}

export function MainTabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 56 + insets.bottom,
          paddingTop: 10,
          paddingBottom: Math.max(insets.bottom, 8),
          backgroundColor: COLORS.surface,
          borderTopWidth: 0,
          elevation: 12,
          shadowColor: COLORS.primary,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.12,
          shadowRadius: 8,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSubtle,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tab.Screen
        name="Inicio"
        component={InicioNavigator}
        options={{
          tabBarLabel: ({ focused, color }) => (
            <Text style={[styles.tabLabel, focused && styles.tabLabelActive, { color }]}>
              Inicio
            </Text>
          ),
          tabBarIcon: ({ focused }) => <TabIcon name="home" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Pagos"
        component={PagosNavigator}
        options={{
          tabBarLabel: ({ focused, color }) => (
            <Text style={[styles.tabLabel, focused && styles.tabLabelActive, { color }]}>
              Pagos
            </Text>
          ),
          tabBarIcon: ({ focused }) => <TabIcon name="credit-card" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Noticias"
        component={NoticiasNavigator}
        options={{
          tabBarLabel: ({ focused, color }) => (
            <Text style={[styles.tabLabel, focused && styles.tabLabelActive, { color }]}>
              Noticias
            </Text>
          ),
          tabBarIcon: ({ focused }) => <TabIcon name="file-text" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={PerfilNavigator}
        options={{
          tabBarLabel: ({ focused, color }) => (
            <Text style={[styles.tabLabel, focused && styles.tabLabelActive, { color }]}>
              Perfil
            </Text>
          ),
          tabBarIcon: ({ focused }) => <TabIcon name="user" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabLabel: {
    fontSize: 10,
    fontWeight: '400',
  },
  tabLabelActive: {
    fontWeight: '600',
  },
});
