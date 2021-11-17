import { en } from './en';
import { fi } from './fi';
import { sv } from './sv';
import { useAppSelector } from '../../../state/hooks';

export const FieldNameLocales = (layerName = '', attributeName = '') => {
        const lang = useAppSelector((state) => state.language);

        // default lang is fi
        let loc = fi;
        if (lang === 'en') {
            loc = en;
        } else if (lang === 'sv') {
            loc = sv;
        }

        const layerLoc = loc[layerName] || {};

        return layerLoc[attributeName] || attributeName;
};

export default FieldNameLocales;
