import strings from '../../translations';

export const VKMGeoJsonStyles = {
    road: {
        tie: {
            stroke: {
                width: 12,
                color: '#e50083'
            }
        },
        osa: {
            stroke: {
                width: 8,
                color: '#e50083'
            }
        },
        etaisyys: {
            image: {
                radius: 14,
                fill: {
                    color: '#e50083'
                }
            }
        }
    },
    track: {
        image: {
            shape: 5,
            size: 3,
            fill: {
                color: '#e50083'
            }
        }
    }
};

export const VKMGeoJsonHoverStyles = {
    road: {
        tie: {
            inherit: true,
            effect: 'darken',
            content: [
                { key: strings.search.vkm.tie, valueProperty: 'tie' },
                { key: strings.search.vkm.osa, valueProperty: 'osa' },
                { key: strings.search.vkm.ajorata, valueProperty: 'ajorata' }
            ]
        },
        osa: {
            inherit: true,
            effect: 'darken',
            content: [
                { key: strings.search.vkm.tie, valueProperty: 'tie' },
                { key: strings.search.vkm.osa, valueProperty: 'osa' },
                { key: strings.search.vkm.ajorata, valueProperty: 'ajorata' }
            ]
        },
        etaisyys: {
            inherit: true,
            effect: 'darken',
            content: [
                { key: strings.search.vkm.tie, valueProperty: 'tie' },
                { key: strings.search.vkm.osa, valueProperty: 'osa' },
                { key: strings.search.vkm.ajorata, valueProperty: 'ajorata' },
                { key: strings.search.vkm.etaisyys, valueProperty: 'etaisyys' }
            ]
        }
    },
    track: {
        inherit: true,
        effect: 'darken',
        content: [
            { key: strings.search.vkm.sijaintiraide, valueProperty: 'sijaintiraide' },
            { key: strings.search.vkm.kuvaus, valueProperty: 'sijaintiraide_kuvaus' },
            { key: strings.search.vkm.tyyppi, valueProperty: 'sijaintiraide_tyyppi' },
            { key: strings.search.vkm.ratanumero, valueProperty: 'ratanumero' },
            { key: strings.search.vkm.ratakilometri, valueProperty: 'ratakilometri' },
            { key: strings.search.vkm.ratametri, valueProperty: 'ratametri' },
        ]
    }
};