"use client"
import i18n from "i18next"
import { initReactI18next } from "react-i18next"

const resources = {
  en: {
    translation: {
      pincode: "What is your area pincode?",
      done: "Proceed",
    },
  },
  hi: {
    translation: {
      pincode: "आपके क्षेत्र का पिनकोड क्या है?",
      done: "आगे बढ़ें"
    },
  },
}

i18n.use(initReactI18next).init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n