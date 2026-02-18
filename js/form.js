// ====== Form Module ======
import { compressImage } from './image-utils.js';

// Store compressed photos for the current form session
let pendingPhotos = []; // Array of base64 strings

/**
 * Builds a new house object from the form fields.
 * @returns {object} New house object (includes compressed photos)
 */
export function buildCasaFromForm() {
    return {
        id: Date.now(),
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
        criadoEm: new Date().toISOString()
    };
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

    preview.innerHTML = pendingPhotos.map((base64, idx) => `
        <div class="photo-preview-item">
            <img src="${base64}" alt="Foto ${idx + 1}" />
            <button type="button" class="photo-preview-remove" data-idx="${idx}" title="Remover">×</button>
        </div>
    `).join('');
}

/**
 * Opens the form modal.
 */
export function openForm() {
    document.getElementById('formOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
}

/**
 * Closes the form modal, resets the form and pending photos.
 */
export function closeForm() {
    document.getElementById('formOverlay').classList.remove('open');
    document.body.style.overflow = '';
    pendingPhotos = [];
    renderPhotoPreview();
}

/**
 * Sets up all form event listeners.
 * @param {Function} onSubmit - Callback when form is submitted with new casa object
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
        const files = e.target.files;
        if (!files.length) return;

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
        fileInput.value = ''; // Reset input so same files can be added again
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
        const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
        if (!files.length) return;

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
        const submitBtn = e.target.querySelector('.form-submit');
        submitBtn.textContent = '⏳ Salvando...';
        submitBtn.disabled = true;

        try {
            const novaCasa = buildCasaFromForm();
            await onSubmit(novaCasa);
            closeForm();
            document.getElementById('houseForm').reset();
            pendingPhotos = [];
            renderPhotoPreview();
            alert('Imóvel cadastrado com sucesso! ✅\nTodos que acessarem o site verão este imóvel.');
        } catch (err) {
            console.error('Erro ao salvar:', err);
            alert('Erro ao salvar o imóvel. Tente novamente.');
        } finally {
            submitBtn.textContent = '✅ Cadastrar Imóvel';
            submitBtn.disabled = false;
        }
    });
}
