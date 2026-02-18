// ====== Gallery / Lightbox Module ======

let galleryPhotos = [];
let galleryIndex = 0;

export function openGallery(casaId, casas) {
    const casa = casas.find(c => c.id === casaId);
    if (!casa || casa.fotos.length === 0) return;
    galleryPhotos = casa.fotos;
    galleryIndex = 0;
    document.getElementById('modalTitle').textContent = casa.nome;
    updateGalleryImage();
    renderThumbnails();
    const overlay = document.getElementById('modalOverlay');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}

export function closeGallery() {
    document.getElementById('modalOverlay').classList.remove('open');
    document.body.style.overflow = '';
}

function updateGalleryImage() {
    const img = document.getElementById('modalImage');
    img.style.opacity = '0';
    setTimeout(() => {
        img.src = encodeURI(galleryPhotos[galleryIndex]);
        img.onload = () => { img.style.opacity = '1'; };
    }, 150);
    document.getElementById('modalCounter').textContent = `${galleryIndex + 1} / ${galleryPhotos.length}`;
    document.querySelectorAll('.modal__thumb').forEach((t, i) => {
        t.classList.toggle('active', i === galleryIndex);
    });
}

function renderThumbnails() {
    const container = document.getElementById('modalThumbs');
    container.innerHTML = galleryPhotos.map((src, i) =>
        `<img class="modal__thumb ${i === 0 ? 'active' : ''}" src="${encodeURI(src)}" alt="Miniatura ${i + 1}" data-index="${i}" />`
    ).join('');
}

export function prevPhoto() {
    galleryIndex = (galleryIndex - 1 + galleryPhotos.length) % galleryPhotos.length;
    updateGalleryImage();
}

export function nextPhoto() {
    galleryIndex = (galleryIndex + 1) % galleryPhotos.length;
    updateGalleryImage();
}

export function goToPhoto(idx) {
    galleryIndex = idx;
    updateGalleryImage();
}

export function initGalleryListeners() {
    document.getElementById('modalClose').addEventListener('click', closeGallery);
    document.getElementById('modalOverlay').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) closeGallery();
    });
    document.getElementById('modalPrev').addEventListener('click', prevPhoto);
    document.getElementById('modalNext').addEventListener('click', nextPhoto);

    // Thumbnail clicks
    document.getElementById('modalThumbs').addEventListener('click', (e) => {
        const thumb = e.target.closest('.modal__thumb');
        if (thumb) goToPhoto(Number(thumb.dataset.index));
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!document.getElementById('modalOverlay').classList.contains('open')) return;
        if (e.key === 'Escape') closeGallery();
        if (e.key === 'ArrowLeft') prevPhoto();
        if (e.key === 'ArrowRight') nextPhoto();
    });
}
