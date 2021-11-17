import { en } from './en';
import { sv } from './sv';
import { fi } from './fi';
import { useAppSelector } from '../../../state/hooks';

/**
 * Gets layer feature attribute code values in human readable format.
 * @class CodeListValues
 */
export const GetCodeListValue = (layerName = '', attributeName = '', code = '') => {
        const lang = useAppSelector((state) => state.language);

        // default lang is fi
        let loc = fi;
        if (lang === 'en') {
            loc = en;
        } else if (lang === 'sv') {
            loc = sv;
        }

        const layerLoc = loc[layerName] || {};
        const attributeLoc = layerLoc[attributeName] || {};

        // check at if code list is array of values
        if (code.indexOf(',') > -1 && layerLoc[attributeName]) {
            const codeList = code.split(',');
            const ret = [];
            codeList.forEach(c => {
                ret.push((attributeLoc[c.trim()] || c.trim()));
            });
            return ret.join(', ');
        }

        return attributeLoc[code.trim()] || code.trim();
};

export default GetCodeListValue;
