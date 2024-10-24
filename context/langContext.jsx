import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useState, useEffect } from 'react';

// Create the Language Context
export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    // Set default language to 'ar' if no value is found in localStorage
    const getInitialLang = async () => {
        return 'ar';
    };

    // Create state for language
    const [lang, setLang] = useState("en");

    // Update localStorage when language state changes
    const changeLanguage = () => {
        setLang(lang === 'en' ? "ar" : "en");
        AsyncStorage.setItem("lang", lang === 'en' ? "ar" : "en")
        // localStorage.setItem('appLang', lang);
    };
    const getSavedLang = async () => {
        const prevLang = await AsyncStorage.getItem("lang")
        if (!prevLang) return
        setLang(prevLang)
        // localStorage.setItem('appLang', lang);
    };

    // Provide language state and method to update it to all children
    return (
        <LanguageContext.Provider value={{ lang, changeLanguage, getSavedLang }}>
            {children}
        </LanguageContext.Provider>
    );
};
