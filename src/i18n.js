"use client"
import i18n from "i18next"
import { initReactI18next } from "react-i18next"

const resources = {
  en: {
    translation: {
      pincode: "What is your area pincode?",
      done: "Proceed",
      ask: "Ask your queries in the form of:",
      processing: "Processing Information ...",
      text: "Text",
      audio: "Audio",
      images: "Images"
    },
  },
  hi: {
    translation: {
      pincode: "आपके क्षेत्र का पिनकोड क्या है?",
      done: "आगे बढ़ें",
      ask: "अपने प्रश्न इस रूप में पूछें",
      processing:"जानकारी एकत्रित कर रहे हैं ...",
      text: "लिख कर",
      audio: "बोल कर",
      images: "तसवीर डाल कर"
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