import LogOut from '@/components/LogOut';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import Button from '@/components/ui/Button';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="size-full bg-background">
      <View className="flex-1 items-center justify-center gap-4">
        <Text className="text-primary text-2xl font-bold">Configuración</Text>
        <Button
          title="Actualizar usuario"
          onPress={() => router.push('/(app)/settings/updateUser')}
        />
        <LogOut />
      </View>
    </SafeAreaView>
  );
}
