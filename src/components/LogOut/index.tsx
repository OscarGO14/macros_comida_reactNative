import { Alert, View } from 'react-native';
import Button from '@/components/ui/SubmitButton/Button';
import { auth } from '@/services/firebase';
import { signOut } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';

export default function LogOut() {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('Usuario desconectado exitosamente.');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      let errorMessage = 'Ocurrió un error al cerrar sesión.';
      if (error instanceof FirebaseError) {
        errorMessage = `Error al cerrar sesión: ${error.message} (${error.code})`;
      }
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <View>
      <Button title="Cerrar sesión" onPress={handleLogout} />
    </View>
  );
}
