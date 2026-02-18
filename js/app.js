// ====== Main Application Entry Point ======
import { casas } from './data.js';
import { filterCasas, sortCasas } from './utils.js';
import { renderCard } from './cards.js';
import { openGallery, initGalleryListeners } from './gallery.js';
import { initFirebase, loadCasasFromFirebase, saveCasaToFirebase } from './firebase-service.js';
import { initFormListeners } from './form.js';

// Make openGallery available globally (used by onclick in cards)
window.openGallery = (casaId) => openGallery(casaId, casas);

// ====== STATE ======
let currentFilter = 'all';

// ====== RENDER ======
function render() {
    const grid = document.getElementById('grid');
    const filtered = sortCasas(filterCasas(casas, currentFilter));

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
    const available = casas.filter(c => c.status === 'available').length;
    const discarded = casas.filter(c => c.status === 'discarded').length;
    document.getElementById('stats').innerHTML = `
        <div class="stat-item"><span class="stat-dot stat-dot--available"></span>${available} disponíve${available > 1 ? 'is' : 'l'}</div>
        <div class="stat-item"><span class="stat-dot stat-dot--discarded"></span>${discarded} descartada${discarded > 1 ? 's' : ''}</div>
    `;
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

    // 3. Init form with Firebase save callback
    initFormListeners(async (novaCasa) => {
        const saved = await saveCasaToFirebase(novaCasa);
        if (!saved) throw new Error('Falha ao salvar no Firebase');
        casas.push(novaCasa);
        render();
    });

    // 4. Render hardcoded houses immediately
    render();

    // 5. Load Firebase houses
    const firebaseCasas = await loadCasasFromFirebase();
    firebaseCasas.forEach(c => casas.push(c));
    render();
}

init();
