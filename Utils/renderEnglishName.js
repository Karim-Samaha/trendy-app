import slugify from "slugify"

export const renderEnglishName = (obj) => {
    return obj.nameEn ? obj.nameEn : slugify(obj.name)
}

export function removeArabicChars(str) {
    // Regular expression to match Arabic characters
    const arabicCharPattern = /[\u0600-\u06FF]/g;
    // Replace Arabic characters with an empty string
    return str?.replace(arabicCharPattern, '');
}
