import type { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Pagos: undefined;
  Noticias: undefined;
  Perfil: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  PaymentHistory: undefined;
  PaymentDetail: { pagoId: number };
  PaymentResult: { pagoId: number; status?: string };
  FamilyGroup: undefined;
  NewsDetail: { noticiaId: number };
};

/** @deprecated Use RootStackParamList / MainTabParamList */
export type AppStackParamList = {
  Home: undefined;
  DebtStatus: undefined;
  Profile: undefined;
  PaymentHistory: undefined;
  PaymentDetail: { pagoId: number };
  PaymentResult: { pagoId: number; status?: string };
};
