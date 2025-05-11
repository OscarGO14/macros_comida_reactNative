// scripts/update-ingredients-field.ts
import { Ingredient } from '../src/types/ingredient';
import admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';
import { Collections } from '../src/types/collections';

// -------- Configuración --------
// Asegúrate de que la ruta al archivo JSON sea correcta
// eslint-disable-next-line @typescript-eslint/no-var-requires

const serviceAccount = require('../serviceAccountKey.json'); // Ajusta la ruta si es necesario

const COLLECTION_NAME = Collections.INGREDIENTS; // Confirma que este es el nombre exacto de tu colección

// -----------------------------

// Inicializa Firebase Admin
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // Opcional: Si tienes databaseURL en tu config de Firebase
    // databaseURL: "https://<TU_PROYECTO_ID>.firebaseio.com"
  });
  console.log('Firebase Admin SDK inicializado correctamente.');
} catch (error) {
  console.error('Error inicializando Firebase Admin SDK:', error);
  process.exit(1); // Salir si no se puede inicializar
}

const db = admin.firestore();

async function subirIngredientes() {
  try {
    // Leer el archivo JSON
    const filePath = path.join(__dirname, '../ingredientes_formateados.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const ingredientes: Ingredient[] = JSON.parse(fileContent);

    console.log(`📋 Total de ingredientes a procesar: ${ingredientes.length}`);

    // Referencia a la colección de ingredientes
    const ingredientesRef = db.collection(COLLECTION_NAME);

    // Contador para el progreso
    let contador = 0;

    // Usar Promise.all para procesar en paralelo
    await Promise.all(
      ingredientes.map(async (ingrediente) => {
        try {
          // Añadir el ingrediente a Firestore
          await ingredientesRef.doc().set(ingrediente);

          contador++;
          if (contador % 10 === 0) {
            console.log(`✅ ${contador} ingredientes procesados...`);
          }
        } catch (error) {
          console.error(`Error al procesar ${ingrediente.name}:`, error);
        }
      }),
    );

    console.log(`🎉 ¡Proceso completado! Se subieron ${contador} ingredientes a Firestore.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en el proceso:', error);
    process.exit(1);
  }
}
subirIngredientes();
