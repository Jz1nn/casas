// ====== Firebase Service ======

const FIREBASE_CONFIG = {
    apiKey: "AIzaSyAAGhCHRumL5zj9HCfaJQmlq9JnznqvjGM",
    authDomain: "busca-de-casas-para-alugar.firebaseapp.com",
    projectId: "busca-de-casas-para-alugar",
    storageBucket: "busca-de-casas-para-alugar.firebasestorage.app",
    messagingSenderId: "445659706302",
    appId: "1:445659706302:web:ccaa2c8f35e995c2e97fef"
};

let db = null;

/**
 * Initializes Firebase and Firestore.
 * Uses the global `firebase` object loaded via CDN.
 */
export function initFirebase() {
    if (typeof firebase === 'undefined') {
        console.warn('Firebase SDK not loaded');
        return;
    }
    firebase.initializeApp(FIREBASE_CONFIG);
    db = firebase.firestore();
}

/**
 * Loads all houses from Firestore.
 * @returns {Promise<Array>} Array of house objects from Firebase
 */
export async function loadCasasFromFirebase() {
    if (!db) return [];
    try {
        const snapshot = await db.collection('casas').orderBy('criadoEm', 'asc').get();
        const result = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            data.firebaseId = doc.id;
            result.push(data);
        });
        return result;
    } catch (err) {
        console.error('Erro ao carregar do Firebase:', err);
        return [];
    }
}

/**
 * Saves a new house to Firestore.
 * @param {object} casa - House object to save
 * @returns {Promise<string|false>} Document ID if saved, false on error
 */
export async function saveCasaToFirebase(casa) {
    if (!db) return false;
    try {
        const docRef = await db.collection('casas').add(casa);
        return docRef.id;
    } catch (err) {
        console.error('Erro ao salvar no Firebase:', err);
        return false;
    }
}

/**
 * Updates an existing house document in Firestore.
 * @param {string} firebaseId - Firestore document ID
 * @param {object} data - Updated house data
 * @returns {Promise<boolean>} True if updated successfully
 */
export async function updateCasaInFirebase(firebaseId, data) {
    if (!db) return false;
    try {
        await db.collection('casas').doc(firebaseId).update(data);
        return true;
    } catch (err) {
        console.error('Erro ao atualizar no Firebase:', err);
        return false;
    }
}

/**
 * Deletes a house document from Firestore.
 * @param {string} firebaseId - Firestore document ID
 * @returns {Promise<boolean>} True if deleted successfully
 */
export async function deleteCasaFromFirebase(firebaseId) {
    if (!db) return false;
    try {
        await db.collection('casas').doc(firebaseId).delete();
        return true;
    } catch (err) {
        console.error('Erro ao excluir do Firebase:', err);
        return false;
    }
}
