// ====== Card Rendering ======
import { icons } from './icons.js';
import { formatPrice, whatsappLink } from './utils.js';

/**
 * Renders a single house card as HTML string.
 * @param {object} casa - House data object
 * @returns {string} HTML string for the card
 */
export function renderCard(casa) {
    const coverSrc = casa.fotos.length > 0 ? casa.fotos[0] : '';
    const statusLabel = casa.status === 'available' ? 'Disponível' : 'Descartada';
    const statusClass = casa.status === 'available' ? 'available' : 'discarded';

    return `
        <article class="card ${casa.status === 'discarded' ? 'discarded' : ''}" data-status="${casa.status}" data-id="${casa.id}">
            <div class="card__image-wrapper" onclick="openGallery(${casa.id})" title="Ver fotos">
                ${coverSrc
            ? `<img class="card__image" src="${encodeURI(coverSrc)}" alt="${casa.nome}" loading="lazy" />`
            : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:var(--bg-secondary);"><span style="font-size:48px;opacity:0.3;">🏠</span></div>`
        }
                <div class="card__image-overlay"></div>
                <span class="card__price">${formatPrice(casa.preco)}/mês</span>
                <span class="card__status-badge card__status-badge--${statusClass}">${statusLabel}</span>
                ${casa.fotos.length > 0 ? `<span class="card__photo-count">${icons.camera} ${casa.fotos.length} foto${casa.fotos.length > 1 ? 's' : ''}</span>` : ''}
            </div>
            <div class="card__body">
                <h2 class="card__name">${casa.nome}</h2>
                <div class="card__location">
                    ${icons.pin}
                    <span>${casa.localizacao}</span>
                </div>
                <div class="card__features">
                    <span class="feature">${icons.bed} ${casa.quartos} quarto${casa.quartos > 1 ? 's' : ''}</span>
                    <span class="feature">${icons.bath} ${casa.banheiros} banheiro${casa.banheiros > 1 ? 's' : ''}</span>
                    ${casa.garagem ? `<span class="feature">${icons.car} Garagem</span>` : ''}
                </div>
                <div class="card__info-rows">
                    <div class="card__info-row">
                        ${icons.calendar}
                        <span>Visita agendada</span>
                        ${casa.agendamento
            ? `<span class="info-badge info-badge--scheduled">📅 ${casa.agendamento}</span>`
            : `<span class="info-badge info-badge--not-scheduled">Não agendado</span>`
        }
                    </div>
                    <div class="card__info-row">
                        ${icons.sofa}
                        <span>Mobília</span>
                        <span class="info-badge info-badge--${casa.mobilia === 'mobiliado' ? 'mobiliado' : casa.mobilia === 'semi' ? 'semi' : 'sem'}">
                            ${casa.mobilia === 'mobiliado' ? 'Mobiliado' : casa.mobilia === 'semi' ? 'Semi-mobiliado' : 'Sem mobília'}
                        </span>
                    </div>
                </div>
                <div class="card__contact">
                    ${icons.phone}
                    <span><strong>${casa.contato}</strong> · ${casa.telefone}</span>
                </div>
                ${casa.adicionadoPor ? `<div class="card__contact" style="margin-bottom:12px;font-size:0.78rem;"><span>📝</span><span>Adicionado por <strong>${casa.adicionadoPor}</strong></span></div>` : ''}
                <div class="card__actions">
                    ${casa.fotos.length > 0 ? `<button class="btn btn--gallery" onclick="openGallery(${casa.id})">${icons.images} Ver Fotos</button>` : ''}
                    <a class="btn btn--whatsapp" href="${whatsappLink(casa.telefone, casa.nome)}" target="_blank" rel="noopener">${icons.whatsapp} WhatsApp</a>
                    ${casa.facebookUrl !== '#' ? `<a class="btn btn--facebook" href="${casa.facebookUrl}" target="_blank" rel="noopener">${icons.facebook} Anúncio</a>` : ''}
                </div>
                <div class="card__management">
                    <button class="btn-manage btn-manage--edit" onclick="editCasa(${casa.id})" title="Editar">✏️ Editar</button>
                    <button class="btn-manage btn-manage--delete" onclick="deleteCasa(${casa.id})" title="Excluir">🗑️ Excluir</button>
                </div>
            </div>
        </article>
    `;
}
