// ====== Form Module ======
import { compressImage } from './image-utils.js';

const MAX_PHOTOS = 8; // Firestore 1MB document limit

// Store compressed photos for the current form session
let pendingPhotos = []; // Array of base64 strings or local paths
let editingCasa = null; // null = create mode, object = edit mode

/**
 * Builds a house object from the form fields.
 * In edit mode, preserves the original id and firebaseId.
 * @returns {object} House object
 */
export function buildCasaFromForm() {
    const casa = {
        id: editingCasa ? editingCasa.id : Date.now(),
        nome: document.getElementById('fNome').value,
        contato: document.getElementById('fContato').value,
        telefone: document.getElementById('fTelefone').value,
        preco: Number(document.getElementById('fPreco').value),
        localizacao: document.getElementById('fLocalizacao').value,
        quartos: Number(document.getElementById('fQuartos').value),
        banheiros: Number(document.getElementById('fBanheiros').value),
        garagem: document.getElementById('fGaragem').value === 'true',
        agendamento: document.getElementById('fAgendamento').value || null,
        mobilia: document.getElementById('fMobilia').value,
        status: document.getElementById('fStatus').value,
        facebookUrl: document.getElementById('fFacebook').value || '#',
        adicionadoPor: document.getElementById('fAdicionadoPor').value,
        fotos: [...pendingPhotos],
        criadoEm: editingCasa ? (editingCasa.criadoEm || new Date().toISOString()) : new Date().toISOString()
    };

    // Preserve firebaseId and overrideId in edit mode
    if (editingCasa) {
        if (editingCasa.firebaseId) casa.firebaseId = editingCasa.firebaseId;
        if (editingCasa.overrideId) casa.overrideId = editingCasa.overrideId;
    }

    return casa;
}

/**
 * Renders the photo preview grid.
 */
function renderPhotoPreview() {
    const preview = document.getElementById('photoPreview');
    const counter = document.getElementById('photoCounter');

    if (pendingPhotos.length === 0) {
        preview.innerHTML = '';
        counter.textContent = '';
        return;
    }

    counter.textContent = `${pendingPhotos.length} foto${pendingPhotos.length > 1 ? 's' : ''} selecionada${pendingPhotos.length > 1 ? 's' : ''}`;

    preview.innerHTML = pendingPhotos.map((src, idx) => `
        <div class="photo-preview-item">
            <img src="${src}" alt="Foto ${idx + 1}" />
            <button type="button" class="photo-preview-remove" data-idx="${idx}" title="Remover">×</button>
        </div>
    `).join('');
}

/**
 * Opens the form modal in create mode.
 */
export function openForm() {
    editingCasa = null;
    document.getElementById('formModalTitle').textContent = '🏠 Cadastrar Novo Imóvel';
    document.getElementById('formSubmitBtn').textContent = '✅ Cadastrar Imóvel';
    document.getElementById('formOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
}

/**
 * Opens the form modal in edit mode, pre-filled with casa data.
 * @param {object} casa - House object to edit
 */
export function openFormForEdit(casa) {
    editingCasa = casa;

    // Pre-fill form fields
    document.getElementById('fNome').value = casa.nome;
    document.getElementById('fContato').value = casa.contato;
    document.getElementById('fTelefone').value = casa.telefone;
    document.getElementById('fPreco').value = casa.preco;
    document.getElementById('fLocalizacao').value = casa.localizacao;
    document.getElementById('fQuartos').value = casa.quartos;
    document.getElementById('fBanheiros').value = casa.banheiros;
    document.getElementById('fGaragem').value = String(casa.garagem);
    document.getElementById('fMobilia').value = casa.mobilia;
    document.getElementById('fStatus').value = casa.status;
    document.getElementById('fAgendamento').value = casa.agendamento || '';
    document.getElementById('fFacebook').value = casa.facebookUrl === '#' ? '' : casa.facebookUrl;
    document.getElementById('fAdicionadoPor').value = casa.adicionadoPor || '';

    // Load existing photos into pending photos
    pendingPhotos = [...(casa.fotos || [])];
    renderPhotoPreview();

    // Update modal title and submit button
    document.getElementById('formModalTitle').textContent = '✏️ Editar Imóvel';
    document.getElementById('formSubmitBtn').textContent = '💾 Salvar Alterações';

    document.getElementById('formOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
}

/**
 * Closes the form modal, resets the form and pending photos.
 */
export function closeForm() {
    document.getElementById('formOverlay').classList.remove('open');
    document.body.style.overflow = '';
    editingCasa = null;
    pendingPhotos = [];
    document.getElementById('houseForm').reset();
    renderPhotoPreview();
}

/**
 * Returns the current editing casa (or null if in create mode).
 */
export function getEditingCasa() {
    return editingCasa;
}

/**
 * Sets up all form event listeners.
 * @param {Function} onSubmit - Callback: (casa, isEdit) => Promise
 */
export function initFormListeners(onSubmit) {
    document.getElementById('btnAddHouse').addEventListener('click', openForm);
    document.getElementById('formClose').addEventListener('click', closeForm);

    document.getElementById('formOverlay').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) closeForm();
    });

    // Photo file input
    const fileInput = document.getElementById('fFotos');
    const uploadArea = document.getElementById('uploadArea');

    fileInput.addEventListener('change', async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        const available = MAX_PHOTOS - pendingPhotos.length;
        if (available <= 0) {
            alert(`Limite de ${MAX_PHOTOS} fotos atingido. Remova algumas antes de adicionar novas.`);
            fileInput.value = '';
            return;
        }

        const toProcess = files.slice(0, available);
        if (files.length > available) {
            alert(`Limite de ${MAX_PHOTOS} fotos. Apenas ${available} foto${available > 1 ? 's' : ''} serão adicionadas.`);
        }

        const status = document.getElementById('uploadStatus');
        status.textContent = '⏳ Comprimindo fotos...';

        for (const file of toProcess) {
            try {
                const base64 = await compressImage(file);
                pendingPhotos.push(base64);
            } catch (err) {
                console.error('Erro ao comprimir:', err);
            }
        }

        status.textContent = '';
        fileInput.value = '';
        renderPhotoPreview();
    });

    // Drag & drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', async (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const allFiles = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
        if (!allFiles.length) return;

        const available = MAX_PHOTOS - pendingPhotos.length;
        if (available <= 0) {
            alert(`Limite de ${MAX_PHOTOS} fotos atingido. Remova algumas antes de adicionar novas.`);
            return;
        }

        const files = allFiles.slice(0, available);
        if (allFiles.length > available) {
            alert(`Limite de ${MAX_PHOTOS} fotos. Apenas ${available} foto${available > 1 ? 's' : ''} serão adicionadas.`);
        }

        const status = document.getElementById('uploadStatus');
        status.textContent = '⏳ Comprimindo fotos...';

        for (const file of files) {
            try {
                const base64 = await compressImage(file);
                pendingPhotos.push(base64);
            } catch (err) {
                console.error('Erro ao comprimir:', err);
            }
        }

        status.textContent = '';
        renderPhotoPreview();
    });

    // Remove photo from preview
    document.getElementById('photoPreview').addEventListener('click', (e) => {
        const btn = e.target.closest('.photo-preview-remove');
        if (btn) {
            const idx = Number(btn.dataset.idx);
            pendingPhotos.splice(idx, 1);
            renderPhotoPreview();
        }
    });

    // Form submit
    document.getElementById('houseForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('formSubmitBtn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '⏳ Salvando...';
        submitBtn.disabled = true;

        try {
            const casa = buildCasaFromForm();
            const isEdit = editingCasa !== null;
            await onSubmit(casa, isEdit);
            closeForm();
            alert(isEdit
                ? 'Imóvel atualizado com sucesso! ✅'
                : 'Imóvel cadastrado com sucesso! ✅\nTodos que acessarem o site verão este imóvel.'
            );
        } catch (err) {
            console.error('Erro ao salvar:', err);
            alert('Erro ao salvar o imóvel. Tente novamente.');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}
