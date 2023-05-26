import {sentenceCase} from "change-case";

// ----------------------------------------------------------------------

export function fFlag(flag) {
    return sentenceCase(flag.replace('FLAG_', ''));
}

export function fFlags(flags) {
    if (typeof (flags) !== "object") {
        flags = JSON.parse(flags);
    }

    const mappedArray = flags.map(function (d) {
        return sentenceCase(d.replace('FLAG_', ''));
    });

    return mappedArray.join(', ');
}

export function fFlagBack(formattedFlag) {
    return "FLAG_" + formattedFlag.toUpperCase();
}