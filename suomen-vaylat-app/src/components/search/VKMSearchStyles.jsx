import strings from '../../translations';

export const VKMGeoJsonStyles = {
    tie: {
        stroke: {
            color: '#910aa3',
            width: 12
        }
    },
    osa: {
        stroke: {
            color: '#ffc300',
            width: 8
        }
    },
    etaisyys: {
        image: {
            radius: 14,
            fill: {
                color: '#c73f00'
            }
        }
    }
};

export const VKMGeoJsonHoverStyles = {
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
};