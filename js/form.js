// ====== Form Module ======

/**
 * Builds a new house object from the form fields.
 * @returns {object} New house object
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
        fotos: [],
        criadoEm: new Date().toISOString()
    };
}

/**
 * Opens the form modal.
 */
export function openForm() {
    document.getElementById('formOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
}

/**
 * Closes the form modal and resets the form.
 */
export function closeForm() {
    document.getElementById('formOverlay').classList.remove('open');
    document.body.style.overflow = '';
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
