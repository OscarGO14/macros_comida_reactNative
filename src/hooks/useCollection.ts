import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "@/services/firebase";
import { Ingredient } from "@/types/ingredients";

// hook para extraer documentos de Firestore
export default function useCollection(collectionName: string) {
  const [data, setData] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const collectionRef = collection(db, collectionName);
        const querySnapshot = await getDocs(collectionRef);
        const documents = querySnapshot.docs.map((doc) => {
          // spread id on data
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || "Unknown", // Añade valores por defecto si es necesario
            category: data.category, // Será undefined si no existe
            calories: data.calories || 0,
            proteins: data.proteins || 0,
            carbs: data.carbs || 0,
            fat: data.fat || 0,
          };
        });
        setData(documents);
        setLoading(false);
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    };
    fetchCollection();
  }, [collectionName]);

  return { data, loading, error };
}
