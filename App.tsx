import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import useCollection from "@/hooks/useCollection";
import Collections from "@/types/collections";

export default function App() {
  const {
    data: ingredientsData,
    loading: ingredientsLoading,
    error: ingredientsError,
  } = useCollection(Collections.ingredients);

  return ingredientsData ? (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text>Open up App.tsx to start working on your app 1!</Text>
      <ScrollView>
        {ingredientsData.map((ingredient) => (
          <Text key={ingredient.id}>{ingredient.name}</Text>
        ))}
      </ScrollView>
    </View>
  ) : (
    <View style={styles.container}>
      <Text>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
