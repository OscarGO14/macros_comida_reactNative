import React, { useState } from 'react';
import { auth, db } from '@/services/firebase';
import { deleteUser as deleteAuthUser } from 'firebase/auth';
import { deleteDoc, doc } from 'firebase/firestore';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import SettingsItem from '@/components/ui/SettingsItem';
import { SettingsControlType } from '@/components/ui/SettingsItem/types';
import Screen from '@/components/ui/Screen';
import { handleLogout } from '@/utils/handleLogout';
import ConfirmationModal from '@/components/ConfirmationModal';

export default function SettingsScreen() {
  const router = useRouter();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const deleteUser = async () => {
    try {
      const user = auth.currentUser;

      if (!user) {
        console.log('No hay un usuario autenticado');
        return;
      }

      // Opcional: Primero elimina los datos del usuario de Firestore
      const userDocRef = doc(db, 'users', user.uid);
      await deleteDoc(userDocRef);
      console.log('Datos del usuario eliminados de Firestore');

      // Luego elimina la cuenta de autenticación
      await deleteAuthUser(user);
      console.log('Usuario eliminado exitosamente');

      // Redirige al usuario a la pantalla de login
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);

      // Manejo de errores específicos
      if (error instanceof Error && error.message === 'auth/requires-recent-login') {
        // Firebase requiere que el usuario haya iniciado sesión recientemente
        console.log('Por favor, inicia sesión nuevamente antes de eliminar tu cuenta');
        // Opcional: Redirigir al usuario a la pantalla de login
        router.replace('/(auth)/login');
      } else {
        console.log('Ocurrió un error al intentar eliminar la cuenta');
      }
    } finally {
      setShowConfirmationModal(false);
    }
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
          handleConfirm={deleteUser}
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
