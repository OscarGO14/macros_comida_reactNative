import { signOut } from 'firebase/auth';
import { auth } from '@/services/firebase';
import { FirebaseError } from 'firebase/app';
import Toast from 'react-native-toast-message';

export const handleLogout = async () => {
  try {
    await signOut(auth);
    console.log('Usuario desconectado exitosamente.');
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    let errorMessage = 'Ocurrió un error al cerrar sesión.';
    if (error instanceof FirebaseError) {
      errorMessage = `Error al cerrar sesión: ${error.message} (${error.code})`;
    }
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: errorMessage,
    });
  }
};
