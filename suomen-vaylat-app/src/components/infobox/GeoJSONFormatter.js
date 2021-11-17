import FieldNameLocales from './FieldNameLocales/FieldNameLocales';
import CodeListValues from './CodeListValues/CodeListValues';

/**
 * This class format layer GFI GeoJSON responses to human readable format.
 * Layer can also some GFI modifying attribute info in data/gfi block:
 * - highPriorityFields: Show these GeoJSON feature properties first and different style than other
 * - visibleFields: Show these GeoJSON feature properties second (below highPriorityFields) and "normal" style
 *
 * For example attribute field:
 * {
 *     "data": {
 *         "gfi": {
 *             "highPriorityFields": [
 *                 "laj_tyyppi",
 *                 "vert_taso",
 *                 "laj_taso"
 *             ],
 *             "visibleFields": [
 *                 "ruoppaus",
 *                 "maalaatu"
 *              ]
 *         }
 *     }
 * }
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
            console.log(reOrderedProperties);
            console.log(f.properties);
            //f.properties = reOrderedProperties;
        });
    }

    format (data = {}, layerName) {
        console.log(data);
        let geoJSON = {...data};
        console.log(geoJSON);
        const visibleFields = JSON.parse(geoJSON.features[0].properties._order.replace('\\',''));
        console.log(visibleFields);
        const highPriority = JSON.parse(geoJSON.features[0].properties._orderHigh.replace('\\',''));
        let pretty = [];

        // reorder properties
        this.reOrderFeatureProperties(geoJSON, visibleFields, highPriority);
        //const content = JSON.stringify(geoJSON);
        //data.content = content;

        geoJSON.features.forEach(f => {
            const keys = Object.keys(f.properties);
            keys.forEach(key => {
                pretty.push(this.getContent(layerName, key, f.properties[key], visibleFields, highPriority));
            });
        });
        console.log(pretty);
        return '<table class="geojson-formatted">' + pretty.join('') + '</table>';
    }

    getContent(layerName, key, value, visibleFields, highPriorityFields) {
        const hasConfiguration = highPriorityFields.length !== 0 || visibleFields.length !== 0;
        if (hasConfiguration && highPriorityFields.includes(key)) {
            return '<tr class="high-priority"><td class="title">' +
                FieldNameLocales(layerName, key) + '</td><td>' +
                CodeListValues(layerName, key, value) +
                '</td></tr>';
        } else if (hasConfiguration && visibleFields.includes(key)) {
            return '<tr class="low-priority"><td class="title">' +
            FieldNameLocales(layerName, key) + '</td><td> ' +
                CodeListValues(layerName, key, value) +
                '</td></tr>';
        }

        return '<tr class="low-priority"><td class="title">' +
        FieldNameLocales(layerName, key) + '</td><td> ' +
                    CodeListValues(layerName, key, value) +
                    '</td></tr>';
    };
}