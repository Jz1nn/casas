// ====== Utility Functions ======

/**
 * Formats a number as Brazilian Real currency.
 * @param {number} val - The price value
 * @returns {string} Formatted price string like "R$ 1.500,00"
 */
export function formatPrice(val) {
    return 'R$ ' + val.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
}

/**
 * Generates a WhatsApp link with a pre-filled message.
 * @param {string} phone - Phone number (any format)
 * @param {string} nome - House name for the message
 * @returns {string} WhatsApp URL
 */
export function whatsappLink(phone, nome) {
    const clean = phone.replace(/\D/g, '');
    const num = clean.length <= 11 ? '55' + clean : clean;
    const msg = encodeURIComponent(`Olá! Vi o anúncio da ${nome} e gostaria de mais informações sobre o aluguel.`);
    return `https://wa.me/${num}?text=${msg}`;
}

/**
 * Filters houses by status.
 * @param {Array} casas - Array of house objects
 * @param {string} filter - 'all', 'available', or 'discarded'
 * @returns {Array} Filtered array
 */
export function filterCasas(casas, filter) {
    if (filter === 'all') return [...casas];
    return casas.filter(c => c.status === filter);
}

/**
 * Sorts houses: available first, then discarded.
 * @param {Array} casas - Array of house objects
 * @returns {Array} Sorted array
 */
export function sortCasas(casas) {
    return [...casas].sort((a, b) => {
        if (a.status === 'available' && b.status === 'discarded') return -1;
        if (a.status === 'discarded' && b.status === 'available') return 1;
        return 0;
    });
}

/**
 * Validates that a house object has all required fields with correct types.
 * @param {object} casa - House object to validate
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateCasa(casa) {
    const errors = [];

    if (!casa.nome || typeof casa.nome !== 'string') errors.push('nome deve ser uma string não vazia');
    if (!casa.contato || typeof casa.contato !== 'string') errors.push('contato deve ser uma string não vazia');
    if (!casa.telefone || typeof casa.telefone !== 'string') errors.push('telefone deve ser uma string não vazia');
    if (typeof casa.preco !== 'number' || casa.preco <= 0) errors.push('preco deve ser um número positivo');
    if (!casa.localizacao || typeof casa.localizacao !== 'string') errors.push('localizacao deve ser uma string não vazia');
    if (typeof casa.quartos !== 'number' || casa.quartos < 0) errors.push('quartos deve ser um número >= 0');
    if (typeof casa.banheiros !== 'number' || casa.banheiros < 0) errors.push('banheiros deve ser um número >= 0');
    if (typeof casa.garagem !== 'boolean') errors.push('garagem deve ser boolean');
    if (!['sem', 'semi', 'mobiliado'].includes(casa.mobilia)) errors.push('mobilia deve ser sem, semi ou mobiliado');
    if (!['available', 'discarded'].includes(casa.status)) errors.push('status deve ser available ou discarded');
    if (!Array.isArray(casa.fotos)) errors.push('fotos deve ser um array');

    return { valid: errors.length === 0, errors };
}
