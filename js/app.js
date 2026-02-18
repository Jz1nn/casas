// ====== Main Application Entry Point ======
import { casas as hardcodedCasas } from './data.js';
import { filterCasas, sortCasas } from './utils.js';
import { renderCard } from './cards.js';
import { openGallery, initGalleryListeners } from './gallery.js';
import {
    initFirebase,
    loadCasasFromFirebase,
    saveCasaToFirebase,
    updateCasaInFirebase,
    deleteCasaFromFirebase
} from './firebase-service.js';
import { initFormListeners, openFormForEdit } from './form.js';

// ====== STATE ======
let allCasas = []; // Combined list (hardcoded + firebase, with overrides applied)
let currentFilter = 'all';

// Make openGallery available globally (used by onclick in cards)
window.openGallery = (casaId) => openGallery(casaId, allCasas);

// ====== EDIT / DELETE HANDLERS (global) ======
window.editCasa = (casaId) => {
    const casa = allCasas.find(c => c.id === casaId);
    if (casa) openFormForEdit(casa);
};

window.deleteCasa = async (casaId) => {
    const casa = allCasas.find(c => c.id === casaId);
    if (!casa) return;

    const confirmed = confirm(`Tem certeza que deseja excluir "${casa.nome}"?\nEssa ação não pode ser desfeita.`);
    if (!confirmed) return;

    if (casa.firebaseId) {
        // Firebase house (or override) — delete the document
        const deleted = await deleteCasaFromFirebase(casa.firebaseId);
        if (!deleted) {
            alert('Erro ao excluir. Tente novamente.');
            return;
        }
    }

    // Check if it's a hardcoded house (no firebaseId and id <= 4)
    const isHardcoded = hardcodedCasas.some(h => h.id === casaId);
    if (isHardcoded && !casa.overrideId) {
        // Save a "hidden" flag in Firebase so it stays hidden on reload
        await saveCasaToFirebase({ overrideId: casaId, hidden: true, criadoEm: new Date().toISOString() });
    }

    // Remove from allCasas
    const idx = allCasas.findIndex(c => c.id === casaId);
    if (idx !== -1) allCasas.splice(idx, 1);
    render();
    alert('Imóvel excluído com sucesso! 🗑️');
};

// ====== RENDER ======
function render() {
    const grid = document.getElementById('grid');
    const filtered = sortCasas(filterCasas(allCasas, currentFilter));

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state__icon">🔍</div>
                <p>Nenhuma casa encontrada com este filtro.</p>
            </div>
        `;
    } else {
        grid.innerHTML = filtered.map(renderCard).join('');
    }

    // Stats
    const available = allCasas.filter(c => c.status === 'available').length;
    const discarded = allCasas.filter(c => c.status === 'discarded').length;
    document.getElementById('stats').innerHTML = `
        <div class="stat-item"><span class="stat-dot stat-dot--available"></span>${available} disponíve${available > 1 ? 'is' : 'l'}</div>
        <div class="stat-item"><span class="stat-dot stat-dot--discarded"></span>${discarded} descartada${discarded > 1 ? 's' : ''}</div>
    `;
}

/**
 * Merges hardcoded houses with Firebase data.
 * Firebase overrides (overrideId matching a hardcoded id) replace the local version.
 * Firebase entries with hidden=true remove the hardcoded house.
 * @param {Array} firebaseCasas - Houses loaded from Firebase
 * @returns {Array} Merged house array
 */
function mergeCasas(firebaseCasas) {
    // Start with hardcoded houses
    const merged = hardcodedCasas.map(h => ({ ...h }));

    // Separate overrides, hidden flags, and new houses
    const overrides = firebaseCasas.filter(c => c.overrideId && !c.hidden);
    const hiddenIds = firebaseCasas.filter(c => c.hidden).map(c => c.overrideId);
    const newHouses = firebaseCasas.filter(c => !c.overrideId && !c.hidden);

    // Apply overrides to hardcoded houses
    overrides.forEach(override => {
        const idx = merged.findIndex(h => h.id === override.overrideId);
        if (idx !== -1) {
            merged[idx] = { ...override, id: override.overrideId };
        }
    });

    // Remove hidden hardcoded houses
    const result = merged.filter(h => !hiddenIds.includes(h.id));

    // Add new Firebase houses
    newHouses.forEach(c => result.push(c));

    return result;
}

// ====== FILTERS ======
document.getElementById('filters').addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    render();
});

// ====== INIT ======
async function init() {
    // 1. Init Firebase
    initFirebase();

    // 2. Init gallery listeners
    initGalleryListeners();

    // 3. Init form with submit callback (handles both create and edit)
    initFormListeners(async (casa, isEdit) => {
        if (isEdit) {
            // Check if it's a hardcoded house being edited
            const isHardcoded = hardcodedCasas.some(h => h.id === casa.id);

            if (casa.firebaseId) {
                // Already has a Firebase document — update it
                const { firebaseId, ...data } = casa;
                const updated = await updateCasaInFirebase(firebaseId, data);
                if (!updated) throw new Error('Falha ao atualizar no Firebase');
            } else if (isHardcoded) {
                // Hardcoded house — create an override in Firebase
                const overrideData = { ...casa, overrideId: casa.id };
                delete overrideData.firebaseId;
                const docId = await saveCasaToFirebase(overrideData);
                if (!docId) throw new Error('Falha ao salvar override no Firebase');
                casa.firebaseId = docId;
                casa.overrideId = casa.id;
            }

            // Update in allCasas
            const idx = allCasas.findIndex(c => c.id === casa.id);
            if (idx !== -1) allCasas[idx] = casa;
        } else {
            // New house — save to Firebase
            const docId = await saveCasaToFirebase(casa);
            if (!docId) throw new Error('Falha ao salvar no Firebase');
            casa.firebaseId = docId;
            allCasas.push(casa);
        }
        render();
    });

    // 4. Show hardcoded houses immediately
    allCasas = hardcodedCasas.map(h => ({ ...h }));
    render();

    // 5. Load Firebase and merge
    const firebaseCasas = await loadCasasFromFirebase();
    allCasas = mergeCasas(firebaseCasas);
    render();
}

init();
