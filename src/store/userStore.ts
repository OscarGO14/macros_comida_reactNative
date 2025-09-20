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
      setUser: (userData: IUserStateData | null) => {
        set({ user: userData, isLoading: false, error: null });
      },
      updateUserData: (userData: IUserStateData) => {
        if (userData.uid && userData.email) {
          set({ user: userData, isLoading: false, error: null });
        } else {
          console.error('Invalid user data provided to updateUserData:', userData);
          set({ error: new Error('Datos de usuario inválidos') });
        }
      },
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error: error, isLoading: false }),
      clearUser: () => set({ user: null, isLoading: false, error: null }),
    }),
    {
      name: 'user-storage', // Nombre para identificar el almacenamiento
      storage: createJSONStorage(() => AsyncStorage), // Usamos AsyncStorage para persistencia
      // Solo persistir datos esenciales del usuario, no estados temporales
      partialize: (state) => ({
        user: state.user ? {
          uid: state.user.uid,
          email: state.user.email,
          displayName: state.user.displayName,
          dailyGoals: state.user.dailyGoals
          // No persistir history para optimizar storage
        } : null
      }),
    },
  ),
);

// Inicialmente, podríamos querer comprobar si hay un usuario autenticado en Firebase
// y actualizar el store. Esto lo haremos más adelante al integrar Firebase Auth.
