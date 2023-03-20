import {LOCALES} from "./locales";

import {english} from "./translations/english";
import {french} from "./translations/french";
import {spanish} from "./translations/spanish";
import {german} from "./translations/german";

export const messages = {
    [LOCALES.ENGLISH]: english,
    [LOCALES.FRENCH]: french,
    [LOCALES.SPANISH]: spanish,
    [LOCALES.GERMAN]: german,
}
