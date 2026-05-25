import type { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
};

export type InicioStackParamList = {
  Home: undefined;
  FamilyGroup: undefined;
};

export type PagosStackParamList = {
  DebtStatus: undefined;
  PaymentHistory: undefined;
};

export type NoticiasStackParamList = {
  News: undefined;
  NewsDetail: { id: number };
};

export type PerfilStackParamList = {
  Profile: undefined;
};

export type MainTabParamList = {
  Inicio: NavigatorScreenParams<InicioStackParamList> | undefined;
  Pagos: NavigatorScreenParams<PagosStackParamList> | undefined;
  Noticias: NavigatorScreenParams<NoticiasStackParamList> | undefined;
  Perfil: NavigatorScreenParams<PerfilStackParamList> | undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends MainTabParamList {}
  }
}
