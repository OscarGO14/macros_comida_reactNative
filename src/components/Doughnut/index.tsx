// Vamos a hacer un componte Doughnut para mostrar el % de calorias consumidas en el día respecto
// a las calorias totales permitidas.

import React from 'react';
import { Text, View } from 'react-native';

// Componente Doughnut: muestra un gráfico circular de ejemplo
// En el futuro puedes pasarle los datos como props
export default function Doughnut() {
  const data = [
    {
      key: 1,
      value: 50,
      svg: { fill: '#facc15' }, // Proteínas (amarillo)
      arc: { outerRadius: '110%', cornerRadius: 10 },
    },
    {
      key: 2,
      value: 30,
      svg: { fill: '#4ade80' }, // Carbohidratos (verde)
    },
    {
      key: 3,
      value: 20,
      svg: { fill: '#818cf8' }, // Grasas (azul)
    },
  ];

  return (
    <View>
      <Text className="text-primary">Doughnut</Text>
    </View>
  );
}
