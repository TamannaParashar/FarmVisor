"use client"
import i18n from "i18next"
import { initReactI18next } from "react-i18next"

const resources = {
  en: {
    translation: {
      title:"FarmVisor",
      sgnO:"Sign Out",
      pincode: "What is your area pincode?",
      done: "Proceed",
      loading:"Loading...",
      ask: "Ask your queries in the form of:",
      processing: "Processing Information ...",
      text: "Text",
      audio: "Audio",
      images: "Images",
      h1:"Type,Speak, or Upload",
      f1:"You can ask your questions by typing, speaking, or sending crop images.",
      h2:"Get Answers in Your Preferred Language",
      f2:"You receive clear advice in Hindi or English – whichever you prefer.",
      h3:"Crop Disease Detection",
      f3:"Upload a photo of your crop and instantly know if it has any disease.",
      h4:"Simple, Practical Solutions",
      f4:"Get easy-to-follow steps for treatment and prevention.",
      down:"Harness the power of artificial intelligence to revolutionize your farming practices. Get accurate predictions based on weather conditions, optimize crop yields, and make data-driven decisions.",
      down1:"AI + Agriculture",
      accurate:"Accurate",
      eff:"Efficient",
      smart:"Smart",
    },
  },
  hi: {
    translation: {
      title:"फार्मवाइज़र",
      sgnO:"साइन आउट",
      pincode: "आपके क्षेत्र का पिनकोड क्या है?",
      done: "आगे बढ़ें",
      loading:"लोड हो रहा है",
      ask: "अपने प्रश्न इस रूप में पूछें",
      processing:"जानकारी एकत्रित कर रहे हैं ...",
      text: "लिख कर",
      audio: "बोल कर",
      images: "तसवीर डाल कर",
      h1:"टाइप करें, बोलें या अपलोड करें",
      f1:"आप अपने सवाल टाइप करके, बोलकर या फसल की तस्वीर भेजकर पूछ सकते हैं।",
      h2:"अपनी पसंदीदा भाषा में उत्तर प्राप्त करें",
      f2:"आपको साफ़ सलाह हिंदी या अंग्रेज़ी में मिलेगी – जैसी आपको पसंद हो।",
      h3:"फसल रोग का पता लगाना",
      f3:"अपनी फसल की तस्वीर डालें और तुरंत जानें कि कोई रोग है या नहीं।",
      h4:"सरल, व्यावहारिक समाधान",
      f4:"पाएं आसान और काम की सलाह इलाज और बचाव के लिए।",
      down:"अपनी कृषि पद्धतियों में क्रांति लाने के लिए कृत्रिम बुद्धिमत्ता की शक्ति का उपयोग करें। मौसम की स्थिति के आधार पर सटीक पूर्वानुमान प्राप्त करें, फसल की पैदावार को अनुकूलित करें और डेटा-संचालित निर्णय लें।",
      down1:"एआई + कृषि",
      accurate:"सटीक",
      eff:"कुशल",
      smart:"बुद्धिमत्तापूर्ण",
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