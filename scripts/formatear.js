const fs = require('fs');
const path = require('path');

// Ruta al archivo original y al archivo de salida
const inputFile = path.join(__dirname, 'csvjson.json');
const outputFile = path.join(__dirname, 'ingredientes_formateados.json');

try {
  // Leer el archivo JSON
  const data = fs.readFileSync(inputFile, 'utf8');
  const ingredientes = JSON.parse(data);

  // Filtrar y formatear cada ingrediente
  const ingredientesFormateados = ingredientes
    .filter((ing) => ing.Nombre || ing.name) // Filtrar elementos vacíos
    .map((ing) => ({
      name: ing.Nombre || ing.name,
      category: ing.Categoría || ing.category || 'Sin categoría',
      proteins: parseFloat(ing['Proteínas x100grs'] || ing.proteins || 0),
      carbs: parseFloat(ing['Carbs x100grs'] || ing.carbs || 0),
      fats: parseFloat(ing['Grasas x100grs'] || ing.fats || 0),
      calories: parseFloat(ing['Calorías x100grs'] || ing.calories || 0),
    }))
    .filter((ing) => ing.name); // Asegurarse de que el nombre no esté vacío

  // Guardar el resultado en un nuevo archivo
  fs.writeFileSync(outputFile, JSON.stringify(ingredientesFormateados, null, 2), 'utf8');

  console.log(`✅ Archivo guardado correctamente en: ${outputFile}`);
  console.log(`📊 Total de ingredientes procesados: ${ingredientesFormateados.length}`);
} catch (error) {
  console.error('❌ Error al procesar el archivo:', error.message);
}
