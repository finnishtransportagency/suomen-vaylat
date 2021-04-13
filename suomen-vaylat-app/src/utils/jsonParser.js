/* eslint-disable import/no-anonymous-default-export */
import strings from '../translations';

export default {

    parse: (json) => {
        if (!json) return;
        if (json.error) return;
        if (!Array.isArray(json)) {
            let object = {};
            JSON.parse(json.name, (key, value) => {

                if (key === strings.language.currentLanguage) {
                    return Object.assign(object, {
                        id: json.id,
                        value: value,
                        modifiedTimestamp: json.modifiedTimestamp,
                    });
                }
            });
            return object;
        } else {
            let array = [];
            json.map((o) => {
                return JSON.parse(o.name, (key, value) => {

                    if (key === strings.language.currentLanguage) {
                        array.push([o.id, value]);
                    }
                });
            });
            return array;
        }
    },
    languages: (language) => {

        if (!Array.isArray(language)) return;
        let arrayLanguage = [];
        language.map((l) => {
            return JSON.parse(l.shortName, (key, value) => {
                if (key === strings.language.currentLanguage) {
                    arrayLanguage.push([l.id, value]);
                }
            });
        });
        return arrayLanguage;
    },
    timestamp: (date) => {
        if (!date) return;
        return date.split(' ').slice(0, 2).join(' ').replace(/-/g, '.');
    },
    array: (array) => {
        let items = [];
        if (array) {
            array.map((o) => {
                return JSON.parse(o.name, (key, value) => {

                    if (key === strings.language.currentLanguage) {
                        items.push(value);
                    }
                });
            });
        }
        return items.join(', ');
    }
};