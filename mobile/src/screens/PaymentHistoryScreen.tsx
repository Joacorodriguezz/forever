import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NotImplementedScreen } from '../components/NotImplementedScreen';
import type { PagosStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<PagosStackParamList, 'PaymentHistory'>;

export function PaymentHistoryScreen({ navigation }: Props) {
  const canGoBack = navigation.canGoBack();

  return (
    <NotImplementedScreen
      title="Historial de Pagos"
      showBack={canGoBack}
      onBack={() => navigation.goBack()}
    />
  );
}
