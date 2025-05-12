import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { auth, deleteUser } from '@/services/firebase';
import SettingsItem from '@/components/ui/SettingsItem';
import { SettingsControlType } from '@/components/ui/SettingsItem/types';
import Screen from '@/components/ui/Screen';
import { handleLogout } from '@/utils/handleLogout';
import ConfirmationModal from '@/components/ConfirmationModal';
import { useUserStore } from '@/store/userStore';

export default function SettingsScreen() {
  const router = useRouter();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { clearUser } = useUserStore();

  const handleDeleteUser = async () => {
    try {
      const user = auth.currentUser;

      if (!user) {
        console.log('No hay un usuario autenticado');
        return;
      }

      await deleteUser(user.uid);
      clearUser();

      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      if (error instanceof Error && error.message === 'auth/requires-recent-login') {
        console.log('Por favor, inicia sesión nuevamente antes de eliminar tu cuenta');
        router.replace('/(auth)/login');
      } else {
        console.log('Ocurrió un error al intentar eliminar la cuenta');
      }
    } finally {
      setShowConfirmationModal(false);
    }
  };

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
          onPress={() => setShowLogoutModal(true)}
          iconName="logout"
        />
        <SettingsItem
          label="Eliminar usuario"
          controlType={SettingsControlType.ARROW_ONLY}
          onPress={() => setShowConfirmationModal(true)}
          iconName="delete"
        />
        <ConfirmationModal
          isVisible={showConfirmationModal}
          handleConfirm={handleDeleteUser}
          onClose={() => setShowConfirmationModal(false)}
          message="¿Estás seguro de que quieres eliminar tu cuenta?"
        />
        <ConfirmationModal
          isVisible={showLogoutModal}
          handleConfirm={handleLogout}
          onClose={() => setShowLogoutModal(false)}
          message="¿Estás seguro de que quieres cerrar sesión?"
        />
      </View>
    </Screen>
  );
}
