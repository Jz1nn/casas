import { describe, it, expect } from 'vitest';
import { casas, REQUIRED_FIELDS, VALID_STATUS, VALID_MOBILIA } from '../js/data.js';
import { validateCasa } from '../js/utils.js';

// ====== Data Integrity Tests ======
// These tests ensure the hardcoded data never gets corrupted by future edits.

describe('Data Integrity - casas array', () => {
    it('deve ter pelo menos 4 casas cadastradas', () => {
        expect(casas.length).toBeGreaterThanOrEqual(4);
    });

    it('cada casa deve ter um id único', () => {
        const ids = casas.map(c => c.id);
        const uniqueIds = new Set(ids);
        expect(uniqueIds.size).toBe(ids.length);
    });

    it('cada casa deve ter todos os campos obrigatórios', () => {
        casas.forEach((casa, index) => {
            REQUIRED_FIELDS.forEach(field => {
                expect(casa).toHaveProperty(field);
            });
        });
    });

    it('cada casa deve ser válida segundo validateCasa', () => {
        casas.forEach((casa, index) => {
            const result = validateCasa(casa);
            expect(result.valid, `Casa "${casa.nome}" (index ${index}) falhou: ${result.errors.join(', ')}`).toBe(true);
        });
    });

    it('cada casa deve ter status válido', () => {
        casas.forEach(casa => {
            expect(VALID_STATUS).toContain(casa.status);
        });
    });

    it('cada casa deve ter mobília válida', () => {
        casas.forEach(casa => {
            expect(VALID_MOBILIA).toContain(casa.mobilia);
        });
    });

    it('fotos deve ser sempre um array', () => {
        casas.forEach(casa => {
            expect(Array.isArray(casa.fotos)).toBe(true);
        });
    });

    it('preço deve ser um número positivo', () => {
        casas.forEach(casa => {
            expect(typeof casa.preco).toBe('number');
            expect(casa.preco).toBeGreaterThan(0);
        });
    });

    it('quartos e banheiros devem ser >= 0', () => {
        casas.forEach(casa => {
            expect(casa.quartos).toBeGreaterThanOrEqual(0);
            expect(casa.banheiros).toBeGreaterThanOrEqual(0);
        });
    });

    it('garagem deve ser boolean', () => {
        casas.forEach(casa => {
            expect(typeof casa.garagem).toBe('boolean');
        });
    });
});

// ====== Specific house tests (regression) ======
describe('Specific houses - regressão', () => {
    it('Jardim Italamar deve estar disponível', () => {
        const casa = casas.find(c => c.nome.includes('Italamar'));
        expect(casa).toBeDefined();
        expect(casa.status).toBe('available');
    });

    it('Rua Aurora deve estar descartada', () => {
        const casa = casas.find(c => c.nome.includes('Aurora'));
        expect(casa).toBeDefined();
        expect(casa.status).toBe('discarded');
    });

    it('Rua Aroeira deve ter 21 fotos', () => {
        const casa = casas.find(c => c.nome.includes('Aroeira'));
        expect(casa).toBeDefined();
        expect(casa.fotos.length).toBe(21);
    });

    it('Eco América deve ter 9 fotos', () => {
        const casa = casas.find(c => c.nome.includes('Eco'));
        expect(casa).toBeDefined();
        expect(casa.fotos.length).toBe(9);
    });
});
