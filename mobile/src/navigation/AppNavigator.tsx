import { useEffect, useRef } from 'react';
import { ActivityIndicator, Linking, Platform, StyleSheet, View } from 'react-native';
import { NavigationContainer, type NavigationContainerRef } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { ComingSoonScreen } from '../screens/ComingSoonScreen';
import { DebtStatusScreen } from '../screens/DebtStatusScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { PaymentDetailScreen } from '../screens/PaymentDetailScreen';
import { PaymentHistoryScreen } from '../screens/PaymentHistoryScreen';
import { PaymentResultScreen } from '../screens/PaymentResultScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import type { AuthStackParamList, MainTabParamList, RootStackParamList } from './types';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_ACTIVE = '#003366';
const TAB_INACTIVE = '#999999';

const linking = {
  prefixes: ['forever://'],
  config: {
    screens: {
      PaymentResult: 'payment/result',
    },
  },
};

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
    </AuthStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: TAB_ACTIVE,
        tabBarInactiveTintColor: TAB_INACTIVE,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ color, size }) => {
          const iconName = getTabIcon(route.name);
          return <Feather name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: 'Inicio' }}
      />
      <Tab.Screen
        name="Pagos"
        component={DebtStatusScreen}
        options={{ tabBarLabel: 'Pagos' }}
      />
      <Tab.Screen
        name="Noticias"
        component={ComingSoonScreen}
        options={{ tabBarLabel: 'Noticias' }}
      />
      <Tab.Screen
        name="Perfil"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Perfil' }}
      />
    </Tab.Navigator>
  );
}

function getTabIcon(routeName: keyof MainTabParamList): keyof typeof Feather.glyphMap {
  switch (routeName) {
    case 'Home':
      return 'home';
    case 'Pagos':
      return 'credit-card';
    case 'Noticias':
      return 'book-open';
    case 'Perfil':
      return 'user';
    default:
      return 'circle';
  }
}

function AppNavigatorStack() {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="MainTabs" component={MainTabs} />
      <RootStack.Screen name="PaymentHistory" component={PaymentHistoryScreen} />
      <RootStack.Screen name="PaymentDetail" component={PaymentDetailScreen} />
      <RootStack.Screen name="PaymentResult" component={PaymentResultScreen} />
    </RootStack.Navigator>
  );
}

function parsePaymentDeepLink(url: string): { pagoId: number; status?: string } | null {
  try {
    const parsed = new URL(url.replace('forever://', 'https://forever.app/'));
    const pagoId = parseInt(parsed.searchParams.get('pagoId') ?? '', 10);
    const status = parsed.searchParams.get('status') ?? undefined;
    if (!pagoId || Number.isNaN(pagoId)) return null;
    return { pagoId, status };
  } catch {
    return null;
  }
}

export function AppNavigator() {
  const { user, isBootstrapping } = useAuth();
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null);

  useEffect(() => {
    const handleUrl = (url: string) => {
      if (!user || !url.includes('payment')) return;
      const params = parsePaymentDeepLink(url);
      if (params && navigationRef.current?.isReady()) {
        navigationRef.current.navigate('PaymentResult', params);
      }
    };

    void Linking.getInitialURL().then((url) => {
      if (url) handleUrl(url);
    });

    const sub = Linking.addEventListener('url', ({ url }) => handleUrl(url));
    return () => sub.remove();
  }, [user]);

  if (isBootstrapping) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#003366" />
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef} linking={user ? linking : undefined}>
      {user ? <AppNavigatorStack /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F7FA',
  },
  tabBar: {
    height: Platform.OS === 'ios' ? 83 : 64,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0,
    elevation: 8,
    shadowColor: '#003366',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
});
