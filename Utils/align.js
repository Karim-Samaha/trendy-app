import { Platform } from "react-native"

export const textAlign = (lang) => {
    if (lang === 'ar') {
        return Platform.OS === 'ios' ? "right" : "right"
    } else {
        return "left"
    }
}
export const direction = () => {
    return Platform.OS === 'ios' ? "ltr" : "rtl"
}

