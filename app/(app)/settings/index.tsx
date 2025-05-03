import { View, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import SettingsItem from '@/components/ui/SettingsItem';
import { SettingsControlType } from '@/components/ui/SettingsItem/types';
import Screen from '@/components/ui/Screen';
import { handleLogout } from '@/utils/handleLogout';

export default function SettingsScreen() {
  const router = useRouter();

  const handleLogoutModal = () => {
    console.log('handleLogoutModal triggered');
    Alert.alert('Cerrar sesión', '¿Estás seguro de que quieres cerrar sesión?', [
      {
        text: 'Cancelar',
        onPress: () => console.log('Cancelado'),
        style: 'cancel',
      },
      {
        text: 'Cerrar sesión',
        onPress: handleLogout,
        style: 'destructive',
      },
    ]);
  };
  // TODO: Cambiar modo oscuro a un switch que guarde en el local storage.
  return (
    <Screen>
      <View className="w-full gap-4 mt-6">
        <SettingsItem
          label="Modo Oscuro"
          controlType={SettingsControlType.SWITCH}
          value={true}
          onPress={() => console.log('Opción 1')}
          iconName="weather-night"
        />

        <SettingsItem
          label="Actualizar información de usuario"
          controlType={SettingsControlType.ARROW_ONLY}
          onPress={() => router.push('/(app)/settings/updateUser')}
          iconName="account"
        />
        <SettingsItem
          label="Cerrar sesión"
          controlType={SettingsControlType.ARROW_ONLY}
          onPress={handleLogoutModal}
          iconName="logout"
        />
      </View>
    </Screen>
  );
}
