// scripts/update-ingredients-field.ts
import admin from 'firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

// -------- Configuración --------
// Asegúrate de que la ruta al archivo JSON sea correcta
// eslint-disable-next-line @typescript-eslint/no-var-requires

const serviceAccount = require('../serviceAccountKey.json'); // Ajusta la ruta si es necesario

const COLLECTION_NAME = 'ingredients'; // Confirma que este es el nombre exacto de tu colección
const OLD_FIELD_NAME = 'fat';
const NEW_FIELD_NAME = 'fats';
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

async function updateIngredients() {
  console.log(`Buscando documentos en la colección "${COLLECTION_NAME}"...`);
  const ingredientsRef = db.collection(COLLECTION_NAME);
  const snapshot = await ingredientsRef.get();

  if (snapshot.empty) {
    console.log('No se encontraron documentos en la colección.');
    return;
  }

  console.log(`Se encontraron ${snapshot.size} documentos. Procesando...`);

  const batch = db.batch(); // Usar un batch para actualizaciones masivas (más eficiente)
  let updatesCount = 0;

  snapshot.forEach((doc) => {
    const data = doc.data();

    // Comprueba si el campo antiguo existe y el nuevo no
    if (data && data[OLD_FIELD_NAME] !== undefined && data[NEW_FIELD_NAME] === undefined) {
      const oldValue = data[OLD_FIELD_NAME];
      console.log(
        `Documento ${doc.id}: Se encontró '${OLD_FIELD_NAME}' (${oldValue}). Preparando actualización.`,
      );

      // Añade la operación de actualización al batch
      batch.update(doc.ref, {
        [NEW_FIELD_NAME]: oldValue, // Añade el nuevo campo con el valor antiguo
        [OLD_FIELD_NAME]: FieldValue.delete(), // Elimina el campo antiguo
      });
      updatesCount++;
    } else if (data && data[OLD_FIELD_NAME] !== undefined && data[NEW_FIELD_NAME] !== undefined) {
      console.log(`Documento ${doc.id}: Ya contiene '${NEW_FIELD_NAME}'. Omitiendo.`);
    } else if (data && data[OLD_FIELD_NAME] === undefined) {
      console.log(`Documento ${doc.id}: No contiene el campo '${OLD_FIELD_NAME}'. Omitiendo.`);
    }
  });

  if (updatesCount > 0) {
    console.log(`Se prepararon ${updatesCount} actualizaciones. Ejecutando batch...`);
    try {
      await batch.commit();
      console.log(`¡Éxito! ${updatesCount} documentos actualizados.`);
    } catch (error) {
      console.error('Error al ejecutar el batch de actualizaciones:', error);
    }
  } else {
    console.log('No se requirieron actualizaciones.');
  }
}

// Ejecuta la función principal
updateIngredients()
  .then(() => {
    console.log('Script completado.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error durante la ejecución del script:', error);
    process.exit(1);
  });
