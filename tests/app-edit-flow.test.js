import { describe, it, expect, vi, beforeEach } from 'vitest';

// ====== Integration Tests: Edit/Save Flow ======
// Tests the logic of app.js edit flow using mocked Firebase service.

// --- Mocks ---
const mockSave = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();

vi.mock('../js/firebase-service.js', () => ({
    initFirebase: vi.fn().mockResolvedValue(undefined),
    loadCasasFromFirebase: vi.fn().mockResolvedValue([]),
    saveCasaToFirebase: mockSave,
    updateCasaInFirebase: mockUpdate,
    deleteCasaFromFirebase: mockDelete,
}));

// Simulate the mergeCasas + onSubmit logic from app.js inline
function buildSubmitHandler(hardcodedCasas, allCasas, { save, update }) {
    return async function onSubmit(casa, isEdit) {
        if (isEdit) {
            const isHardcoded = hardcodedCasas.some(h => h.id === casa.id);

            if (casa.firebaseId) {
                const { firebaseId, ...data } = casa;
                const updated = await update(firebaseId, data);
                if (!updated) throw new Error('Falha ao atualizar no Firebase');
            } else if (isHardcoded) {
                const overrideData = { ...casa, overrideId: casa.id };
                delete overrideData.firebaseId;
                const docId = await save(overrideData);
                if (!docId) throw new Error('Falha ao salvar override no Firebase');
                casa.firebaseId = docId;
                casa.overrideId = casa.id;
            }

            const idx = allCasas.findIndex(c => c.id === casa.id);
            if (idx !== -1) allCasas[idx] = casa;
        } else {
            const docId = await save(casa);
            if (!docId) throw new Error('Falha ao salvar no Firebase');
            casa.firebaseId = docId;
            allCasas.push(casa);
        }
    };
}

const baseCasa = {
    id: 1,
    nome: 'Casa Teste',
    contato: 'João',
    telefone: '73 99999-0000',
    preco: 1500,
    localizacao: 'Rua A, 1',
    quartos: 2,
    banheiros: 1,
    garagem: true,
    agendamento: null,
    mobilia: 'sem',
    status: 'available',
    facebookUrl: '#',
    fotos: [],
    criadoEm: '2026-01-01T00:00:00.000Z',
};

// ====== Test Suites ======

describe('Edit flow: updating a Firebase casa (has firebaseId)', () => {
    let allCasas;
    let submit;

    beforeEach(() => {
        vi.clearAllMocks();
        allCasas = [{ ...baseCasa, firebaseId: 'fb-abc123' }];
        submit = buildSubmitHandler([], allCasas, { save: mockSave, update: mockUpdate });
    });

    it('calls updateCasaInFirebase when casa has firebaseId', async () => {
        mockUpdate.mockResolvedValue(true);
        const edited = { ...allCasas[0], preco: 2000 };
        await submit(edited, true);
        expect(mockUpdate).toHaveBeenCalledWith('fb-abc123', expect.objectContaining({ preco: 2000 }));
    });

    it('does NOT call saveCasaToFirebase when updating existing casa', async () => {
        mockUpdate.mockResolvedValue(true);
        await submit({ ...allCasas[0], nome: 'Novo Nome' }, true);
        expect(mockSave).not.toHaveBeenCalled();
    });

    it('does NOT include firebaseId in the data sent to Firestore', async () => {
        mockUpdate.mockResolvedValue(true);
        await submit({ ...allCasas[0], preco: 1600 }, true);
        const [, data] = mockUpdate.mock.calls[0];
        expect(data.firebaseId).toBeUndefined();
    });

    it('updates allCasas in memory after successful save', async () => {
        mockUpdate.mockResolvedValue(true);
        await submit({ ...allCasas[0], preco: 1800 }, true);
        expect(allCasas[0].preco).toBe(1800);
    });

    it('throws if updateCasaInFirebase returns false (e.g. Firestore rules block write)', async () => {
        mockUpdate.mockResolvedValue(false); // Simulates Firestore rule rejection
        await expect(submit({ ...allCasas[0], preco: 999 }, true))
            .rejects.toThrow('Falha ao atualizar no Firebase');
    });

    it('does NOT update allCasas if Firebase save fails', async () => {
        mockUpdate.mockResolvedValue(false);
        try { await submit({ ...allCasas[0], preco: 999 }, true); } catch { }
        expect(allCasas[0].preco).not.toBe(999);
    });
});

describe('Edit flow: updating a hardcoded casa (no firebaseId)', () => {
    let allCasas;
    let hardcodedCasas;
    let submit;

    beforeEach(() => {
        vi.clearAllMocks();
        hardcodedCasas = [{ ...baseCasa }];
        allCasas = [{ ...baseCasa }];
        submit = buildSubmitHandler(hardcodedCasas, allCasas, { save: mockSave, update: mockUpdate });
    });

    it('creates an override in Firebase for hardcoded casa', async () => {
        mockSave.mockResolvedValue('override-id-xyz');
        await submit({ ...baseCasa, preco: 1700 }, true);
        expect(mockSave).toHaveBeenCalledWith(expect.objectContaining({
            overrideId: baseCasa.id,
            preco: 1700,
        }));
    });

    it('sets firebaseId and overrideId on the casa object after override save', async () => {
        mockSave.mockResolvedValue('override-id-xyz');
        const edited = { ...baseCasa, preco: 1700 };
        await submit(edited, true);
        expect(edited.firebaseId).toBe('override-id-xyz');
        expect(edited.overrideId).toBe(baseCasa.id);
    });

    it('throws if saveCasaToFirebase returns false for override', async () => {
        mockSave.mockResolvedValue(false);
        await expect(submit({ ...baseCasa, nome: 'Edited' }, true))
            .rejects.toThrow('Falha ao salvar override no Firebase');
    });
});

describe('Create flow: adding a new casa', () => {
    let allCasas;
    let submit;

    beforeEach(() => {
        vi.clearAllMocks();
        allCasas = [];
        submit = buildSubmitHandler([], allCasas, { save: mockSave, update: mockUpdate });
    });

    it('calls saveCasaToFirebase for a new casa', async () => {
        mockSave.mockResolvedValue('new-doc-id');
        await submit({ ...baseCasa, id: Date.now() }, false);
        expect(mockSave).toHaveBeenCalled();
    });

    it('pushes new casa to allCasas after save', async () => {
        mockSave.mockResolvedValue('new-doc-id');
        await submit({ ...baseCasa, id: 99 }, false);
        expect(allCasas).toHaveLength(1);
        expect(allCasas[0].id).toBe(99);
    });

    it('sets firebaseId on new casa after save', async () => {
        mockSave.mockResolvedValue('new-doc-id');
        const nova = { ...baseCasa, id: 99 };
        await submit(nova, false);
        expect(nova.firebaseId).toBe('new-doc-id');
    });

    it('throws if saveCasaToFirebase returns false for new casa', async () => {
        mockSave.mockResolvedValue(false);
        await expect(submit({ ...baseCasa, id: 99 }, false))
            .rejects.toThrow('Falha ao salvar no Firebase');
    });
});
