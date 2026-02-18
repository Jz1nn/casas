import { describe, it, expect, vi } from 'vitest';
import { renderCard } from '../js/cards.js';

// ====== Card Rendering Tests ======
// These tests ensure the card HTML structure stays consistent.

const mockCasa = {
    id: 99,
    nome: 'Casa de Teste',
    contato: 'Fulano',
    telefone: '73 99999-0000',
    preco: 1200,
    localizacao: 'Rua dos Testes, 42',
    quartos: 3,
    banheiros: 2,
    garagem: true,
    agendamento: '20/02 às 15h',
    mobilia: 'semi',
    status: 'available',
    facebookUrl: 'https://facebook.com/test',
    fotos: ['foto1.jpg', 'foto2.jpg']
};

describe('renderCard', () => {
    it('retorna string HTML válida', () => {
        const html = renderCard(mockCasa);
        expect(typeof html).toBe('string');
        expect(html).toContain('<article');
        expect(html).toContain('</article>');
    });

    it('exibe o nome da casa', () => {
        const html = renderCard(mockCasa);
        expect(html).toContain('Casa de Teste');
    });

    it('exibe o preço formatado', () => {
        const html = renderCard(mockCasa);
        expect(html).toContain('R$');
        expect(html).toContain('1.200');
    });

    it('exibe a localização', () => {
        const html = renderCard(mockCasa);
        expect(html).toContain('Rua dos Testes, 42');
    });

    it('exibe a quantidade de quartos e banheiros', () => {
        const html = renderCard(mockCasa);
        expect(html).toContain('3 quartos');
        expect(html).toContain('2 banheiros');
    });

    it('exibe "Garagem" quando garagem é true', () => {
        const html = renderCard(mockCasa);
        expect(html).toContain('Garagem');
    });

    it('não exibe "Garagem" quando garagem é false', () => {
        const html = renderCard({ ...mockCasa, garagem: false });
        expect(html).not.toContain('Garagem');
    });

    it('exibe badge "Disponível" para status available', () => {
        const html = renderCard(mockCasa);
        expect(html).toContain('Disponível');
        expect(html).toContain('card__status-badge--available');
    });

    it('exibe badge "Descartada" para status discarded', () => {
        const html = renderCard({ ...mockCasa, status: 'discarded' });
        expect(html).toContain('Descartada');
        expect(html).toContain('card__status-badge--discarded');
    });

    it('aplica classe "discarded" no card quando status é discarded', () => {
        const html = renderCard({ ...mockCasa, status: 'discarded' });
        expect(html).toContain('class="card discarded"');
    });

    it('exibe agendamento quando presente', () => {
        const html = renderCard(mockCasa);
        expect(html).toContain('20/02 às 15h');
    });

    it('exibe "Não agendado" quando agendamento é null', () => {
        const html = renderCard({ ...mockCasa, agendamento: null });
        expect(html).toContain('Não agendado');
    });

    it('exibe mobília corretamente - Semi-mobiliado', () => {
        const html = renderCard({ ...mockCasa, mobilia: 'semi' });
        expect(html).toContain('Semi-mobiliado');
    });

    it('exibe mobília corretamente - Sem mobília', () => {
        const html = renderCard({ ...mockCasa, mobilia: 'sem' });
        expect(html).toContain('Sem mobília');
    });

    it('exibe mobília corretamente - Mobiliado', () => {
        const html = renderCard({ ...mockCasa, mobilia: 'mobiliado' });
        expect(html).toContain('Mobiliado');
    });

    it('exibe contato e telefone', () => {
        const html = renderCard(mockCasa);
        expect(html).toContain('Fulano');
        expect(html).toContain('73 99999-0000');
    });

    it('exibe botão WhatsApp com link correto', () => {
        const html = renderCard(mockCasa);
        expect(html).toContain('wa.me/5573999990000');
        expect(html).toContain('WhatsApp');
    });

    it('exibe botão Facebook quando URL presente', () => {
        const html = renderCard(mockCasa);
        expect(html).toContain('facebook.com/test');
        expect(html).toContain('Anúncio');
    });

    it('não exibe botão Facebook quando URL é "#"', () => {
        const html = renderCard({ ...mockCasa, facebookUrl: '#' });
        expect(html).not.toContain('btn--facebook');
    });

    it('exibe contagem de fotos', () => {
        const html = renderCard(mockCasa);
        expect(html).toContain('2 fotos');
    });

    it('exibe "foto" (singular) para 1 foto', () => {
        const html = renderCard({ ...mockCasa, fotos: ['foto1.jpg'] });
        expect(html).toContain('1 foto');
        expect(html).not.toContain('1 fotos');
    });

    it('exibe placeholder quando não há fotos', () => {
        const html = renderCard({ ...mockCasa, fotos: [] });
        expect(html).toContain('🏠');
        expect(html).not.toContain('card__photo-count');
    });

    it('exibe "Adicionado por" quando adicionadoPor presente', () => {
        const html = renderCard({ ...mockCasa, adicionadoPor: 'Maria' });
        expect(html).toContain('Adicionado por');
        expect(html).toContain('Maria');
    });

    it('não exibe "Adicionado por" quando campo ausente', () => {
        const html = renderCard(mockCasa);
        expect(html).not.toContain('Adicionado por');
    });

    it('usa singular "quarto" para 1 quarto', () => {
        const html = renderCard({ ...mockCasa, quartos: 1 });
        expect(html).toContain('1 quarto');
        expect(html).not.toContain('1 quartos');
    });

    it('usa singular "banheiro" para 1 banheiro', () => {
        const html = renderCard({ ...mockCasa, banheiros: 1 });
        expect(html).toContain('1 banheiro');
        expect(html).not.toContain('1 banheiros');
    });

    it('inclui data-id com o id da casa', () => {
        const html = renderCard(mockCasa);
        expect(html).toContain('data-id="99"');
    });

    // ====== Base64 Photo Tests ======
    it('renderiza card com fotos base64', () => {
        const casa = { ...mockCasa, fotos: ['data:image/jpeg;base64,/9j/4AAQ...'] };
        const html = renderCard(casa);
        expect(html).toContain('data:image/jpeg;base64');
        expect(html).toContain('1 foto');
    });

    it('renderiza card com mix de fotos locais e base64', () => {
        const casa = { ...mockCasa, fotos: ['foto1.jpg', 'data:image/jpeg;base64,abc123'] };
        const html = renderCard(casa);
        expect(html).toContain('2 fotos');
        expect(html).toContain('foto1.jpg');
    });

    // ====== Management Buttons Tests ======
    it('exibe botão Editar', () => {
        const html = renderCard(mockCasa);
        expect(html).toContain('Editar');
        expect(html).toContain('btn-manage--edit');
        expect(html).toContain('editCasa(99)');
    });

    it('exibe botão Excluir', () => {
        const html = renderCard(mockCasa);
        expect(html).toContain('Excluir');
        expect(html).toContain('btn-manage--delete');
        expect(html).toContain('deleteCasa(99)');
    });
});
