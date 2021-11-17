import { fiHanketiedot } from "./locales/fiHanketiedot";
import { fiVesivaylaTiedot } from "./locales/fiVesivaylatiedot";

/**
 * Layer feature attribute name localizations in finnish.
 *
 * Locale object contains 0...n layer objects.
 *
 * '<layer name>': {
 *    '<feature_attribute_name>': {
 *       '<feature_attribute_name1>': '<attribute1 name for finnish>',
 *       '<feature_attribute_name2>': '<attribute2 name for finnish>'
 *    }
 * }
 *
 * For example:
 * 'vesivaylatiedot:lajitysalueet': {
 *        'laj_tyyppi': 'Läjitystyyppi'
 *   }
 */
export const fi = {...fiVesivaylaTiedot, ...fiHanketiedot};