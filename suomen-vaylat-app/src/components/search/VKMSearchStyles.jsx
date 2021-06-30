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
            { key: 'Tie', valueProperty: 'tie' },
            { key: 'Tieosa', valueProperty: 'osa' },
            { key: 'Ajorata', valueProperty: 'ajorata' }
        ]
    },
    osa: {
        inherit: true,
        effect: 'darken',
        content: [
            { key: 'Tie', valueProperty: 'tie' },
            { key: 'Tieosa', valueProperty: 'osa' },
            { key: 'Ajorata', valueProperty: 'ajorata' }
        ]
    },
    etaisyys: {
        inherit: true,
        effect: 'darken',
        content: [
            { key: 'Tie', valueProperty: 'tie' },
            { key: 'Tieosa', valueProperty: 'osa' },
            { key: 'Ajorata', valueProperty: 'ajorata' },
            { key: 'Etäisyys', valueProperty: 'etaisyys' }
        ]
    }
};