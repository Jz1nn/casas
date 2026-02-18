import { describe, it, expect } from 'vitest';
import { formatPrice, whatsappLink, filterCasas, sortCasas, validateCasa } from '../js/utils.js';

// ====== formatPrice ======
describe('formatPrice', () => {
    it('formata 1500 como "R$ 1.500,00"', () => {
        const result = formatPrice(1500);
        expect(result).toContain('R$');
        expect(result).toContain('1.500');
    });

    it('formata 0 como "R$ 0,00"', () => {
        const result = formatPrice(0);
        expect(result).toContain('R$');
        expect(result).toContain('0');
    });

    it('formata valores decimais corretamente', () => {
        const result = formatPrice(1234.5);
        expect(result).toContain('R$');
        expect(result).toContain('1.234');
    });
});

// ====== whatsappLink ======
describe('whatsappLink', () => {
    it('gera link do WhatsApp com prefixo 55 para números locais', () => {
        const link = whatsappLink('73 99810-1161', 'Casa Teste');
        expect(link).toContain('https://wa.me/5573998101161');
        expect(link).toContain('text=');
    });

    it('não duplica o prefixo 55 se já presente', () => {
        const link = whatsappLink('5573999990000', 'Casa');
        expect(link).toContain('https://wa.me/5573999990000');
        // Não deve ter 555573...
        expect(link).not.toContain('wa.me/555573');
    });

    it('inclui o nome da casa na mensagem', () => {
        const link = whatsappLink('73 99999-0000', 'Rua Aurora');
        const decoded = decodeURIComponent(link);
        expect(decoded).toContain('Rua Aurora');
    });

    it('remove todos os caracteres não numéricos do telefone', () => {
        const link = whatsappLink('(11) 97314-8901', 'Casa');
        expect(link).toContain('wa.me/5511973148901');
    });
});

// ====== filterCasas ======
describe('filterCasas', () => {
    const mockCasas = [
        { id: 1, status: 'available', nome: 'A' },
        { id: 2, status: 'discarded', nome: 'B' },
        { id: 3, status: 'available', nome: 'C' },
    ];

    it('retorna todas as casas com filtro "all"', () => {
        const result = filterCasas(mockCasas, 'all');
        expect(result).toHaveLength(3);
    });

    it('filtra apenas casas disponíveis', () => {
        const result = filterCasas(mockCasas, 'available');
        expect(result).toHaveLength(2);
        expect(result.every(c => c.status === 'available')).toBe(true);
    });

    it('filtra apenas casas descartadas', () => {
        const result = filterCasas(mockCasas, 'discarded');
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe(2);
    });

    it('não modifica o array original', () => {
        const original = [...mockCasas];
        filterCasas(mockCasas, 'available');
        expect(mockCasas).toEqual(original);
    });
});

// ====== sortCasas ======
describe('sortCasas', () => {
    it('coloca disponíveis antes de descartadas', () => {
        const input = [
            { id: 1, status: 'discarded' },
            { id: 2, status: 'available' },
            { id: 3, status: 'discarded' },
            { id: 4, status: 'available' },
        ];
        const sorted = sortCasas(input);
        expect(sorted[0].status).toBe('available');
        expect(sorted[1].status).toBe('available');
        expect(sorted[2].status).toBe('discarded');
        expect(sorted[3].status).toBe('discarded');
    });

    it('não modifica o array original', () => {
        const input = [
            { id: 1, status: 'discarded' },
            { id: 2, status: 'available' },
        ];
        const original = [...input];
        sortCasas(input);
        expect(input).toEqual(original);
    });
});

// ====== validateCasa ======
describe('validateCasa', () => {
    const validCasa = {
        id: 1,
        nome: 'Casa Teste',
        contato: 'João',
        telefone: '73 99999-0000',
        preco: 1500,
        localizacao: 'Rua dos Testes, 123',
        quartos: 2,
        banheiros: 1,
        garagem: true,
        agendamento: null,
        mobilia: 'sem',
        status: 'available',
        facebookUrl: '#',
        fotos: []
    };

    it('valida uma casa correta sem erros', () => {
        const result = validateCasa(validCasa);
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
    });

    it('rejeita casa sem nome', () => {
        const result = validateCasa({ ...validCasa, nome: '' });
        expect(result.valid).toBe(false);
        expect(result.errors.some(e => e.includes('nome'))).toBe(true);
    });

    it('rejeita preço negativo', () => {
        const result = validateCasa({ ...validCasa, preco: -100 });
        expect(result.valid).toBe(false);
        expect(result.errors.some(e => e.includes('preco'))).toBe(true);
    });

    it('rejeita preço zero', () => {
        const result = validateCasa({ ...validCasa, preco: 0 });
        expect(result.valid).toBe(false);
    });

    it('rejeita status inválido', () => {
        const result = validateCasa({ ...validCasa, status: 'pending' });
        expect(result.valid).toBe(false);
        expect(result.errors.some(e => e.includes('status'))).toBe(true);
    });

    it('rejeita mobilia inválida', () => {
        const result = validateCasa({ ...validCasa, mobilia: 'luxo' });
        expect(result.valid).toBe(false);
        expect(result.errors.some(e => e.includes('mobilia'))).toBe(true);
    });

    it('rejeita garagem não-boolean', () => {
        const result = validateCasa({ ...validCasa, garagem: 'sim' });
        expect(result.valid).toBe(false);
    });

    it('rejeita fotos não-array', () => {
        const result = validateCasa({ ...validCasa, fotos: 'foto.jpg' });
        expect(result.valid).toBe(false);
    });

    it('aceita quartos = 0', () => {
        const result = validateCasa({ ...validCasa, quartos: 0 });
        expect(result.valid).toBe(true);
    });

    it('rejeita quartos negativos', () => {
        const result = validateCasa({ ...validCasa, quartos: -1 });
        expect(result.valid).toBe(false);
    });

    it('retorna múltiplos erros quando há múltiplos problemas', () => {
        const result = validateCasa({ ...validCasa, nome: '', preco: -1, status: 'x' });
        expect(result.valid).toBe(false);
        expect(result.errors.length).toBeGreaterThanOrEqual(3);
    });
});
