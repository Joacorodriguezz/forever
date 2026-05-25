import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NotImplementedScreen } from '../components/NotImplementedScreen';
import type { InicioStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<InicioStackParamList, 'FamilyGroup'>;

export function FamilyGroupScreen({ navigation }: Props) {
  return (
    <NotImplementedScreen
      title="Grupo Familiar"
      showBack
      onBack={() => navigation.goBack()}
    />
  );
}
