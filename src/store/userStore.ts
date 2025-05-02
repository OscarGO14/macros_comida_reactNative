import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IUserState, IUserStateData } from '@/types/user';

// Crea el store con persistencia
export const useUserStore = create<IUserState>()(
  persist(
    (set) => ({
      // Estado inicial
      user: null,
      isLoading: true, // Empezamos asumiendo que podría haber una sesión activa cargándose
      error: null,

      // Acciones para modificar el estado
      setUser: (firebaseUser) => {
        if (firebaseUser) {
          const userData: IUserStateData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
          };
          set({ user: userData, isLoading: false, error: null });
        } else {
          set({ user: null, isLoading: false, error: null });
        }
      },
      updateUserData: (userData: IUserStateData) => {
        if (userData.uid && userData.email) {
          set({ user: userData, isLoading: false, error: null });
        } else {
          set({ user: null, isLoading: false, error: new Error('Error al actualizar el usuario') });
        }
      },
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error: error, isLoading: false }),
      clearUser: () => set({ user: null, isLoading: false, error: null }),
    }),
    {
      name: 'user-storage', // Nombre para identificar el almacenamiento
      storage: createJSONStorage(() => AsyncStorage), // Usamos AsyncStorage para persistencia
      // Opcional: Puedes elegir qué partes del estado persistir
      // partialize: (state) => ({ user: state.user }),
    },
  ),
);

// Inicialmente, podríamos querer comprobar si hay un usuario autenticado en Firebase
// y actualizar el store. Esto lo haremos más adelante al integrar Firebase Auth.
