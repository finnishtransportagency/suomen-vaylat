/**
 * This class format layer GFI GeoJSON responses to human readable format.
 * Layer can also some GFI modifying attribute info in data/gfi block:
 * - highPriorityFields: Show these GeoJSON feature properties first and different style than other
 * - visibleFields: Show these GeoJSON feature properties second (below highPriorityFields) and "normal" style
 *
 * If highPriorityFields and visibleFields are not cofigured then show all properties.
 *
 * Layer feature localized field names come from FieldNameLocales/fi.js, FieldNameLocales/en.js and FieldNameLocales/sv.js
 * Layer feature code list field values come from CodeListValues/fi.js, CodeListValues/en.js and CodeListValues/sv.js
 * @class GeoJSONFormatter
 */
export class GeoJSONFormatter {

    constructor() {
    }

    reOrderFeatureProperties (geoJSON = {}, visibleFields = [], highPriority=[]) {
        if (visibleFields.length === 0 && highPriority.length === 0) {
            return;
        }

        // If visible fields or high priority fields are configured then use them
        geoJSON.features.forEach(f => {
            const reOrderedProperties = {};
            highPriority.forEach(key => {
                if (f.properties[key] !== undefined) {
                    reOrderedProperties[key] = f.properties[key];
                }
            });

            visibleFields.forEach(key => {
                if (f.properties[key] !== undefined) {
                    reOrderedProperties[key] = f.properties[key];
                }
            });
        });
    }

    format (data = {}) {
        let geoJSON = {...data};
        const visibleFields = JSON.parse(geoJSON.features[0].properties._order.replace('\\',''));
        const highPriority = JSON.parse(geoJSON.features[0].properties._orderHigh.replace('\\',''));
        let pretty = [];

        // reorder properties
        this.reOrderFeatureProperties(geoJSON, visibleFields, highPriority);

        geoJSON.features.forEach(f => {
            const keys = Object.keys(f.properties);
            console.log(keys);
            keys.forEach(key => {
                if (key !== "_order" && key !== "_orderHigh") {
                    pretty.push(this.getContent(key, f.properties[key], visibleFields, highPriority));
                }
            });
        });
        return '<table class="geojson-formatted">' + pretty.join('') + '</table>';
    }

    getContent(key, value, visibleFields, highPriorityFields) {
        const hasConfiguration = highPriorityFields.length !== 0 || visibleFields.length !== 0;
        if (hasConfiguration && highPriorityFields.includes(key)) {
            return '<tr class="high-priority"><td class="title">' +
                key + '</td><td>' +
                value +
                '</td></tr>';
        } else if (hasConfiguration && visibleFields.includes(key)) {
            return '<tr class="low-priority"><td class="title">' +
            key + '</td><td> ' +
                value +
                '</td></tr>';
        }

        return '<tr class="low-priority"><td class="title">' +
        key + '</td><td> ' +
                    value +
                    '</td></tr>';
    };
}