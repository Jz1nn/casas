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
 * @returns {Promise<boolean>} True if saved successfully
 */
export async function saveCasaToFirebase(casa) {
    if (!db) return false;
    try {
        await db.collection('casas').add(casa);
        return true;
    } catch (err) {
        console.error('Erro ao salvar no Firebase:', err);
        return false;
    }
}
