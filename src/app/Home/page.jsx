"use client"
import { useTranslation } from "react-i18next"
import i18n from "./../../i18n"
import { signOut } from "next-auth/react"
import { useRef, useState } from "react"
import "../style.css"
import { useRouter } from "next/navigation"
import { createPortal } from "react-dom"

export default function Home() {
  const [pin, setPin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [uploadOptions, setUploadOptions] = useState(false)
  const [text, setText] = useState(false)
  const [icon,setIcon] = useState();
  const [weather,setWeather] = useState("")
  const [loc,setLoc] = useState("")
  const [showWeather, setShowWeather] = useState(false);
  const router = useRouter()
  const { t } = useTranslation()
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang)
  }
  const [proceed,setProceed] = useState("done")

  const inputRefs = Array.from({ length: 6 }, (_, i) => useRef(null))
  const handleChange = (e, index) => {
    const value = e.target.value

    // allow only numbers
    if (!/^[0-9]?$/.test(value)) {
      e.target.value = ""
      return
    }

    if (value && index < 5) {
      inputRefs[index + 1].current.focus()
    }
    if (!value && index > 0) {
      inputRefs[index - 1].current.focus()
    }
  }

  const handleSubmit = async () => {
    const pincode = inputRefs.map((ref) => ref.current?.value || "").join("")
    setLoading(true)
    setProceed("loading")
    try {
      const res = await fetch("/api/locationWeather", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pincode }),
      })
      const data = await res.json()
      console.log(data)
      setIcon(data.weather.icon)
      setWeather(data.weather);
      setLoc(data.location)
      setPin(false)
      setUploadOptions(true)
    } finally {
      setLoading(false)
    }
  }

  const handleText = () => {
    setUploadOptions(false)
    setText(true)
  }

  const txt = useRef(null)

  const handleTextSubmission = async () => {
    const query = txt.current.value
    const text = await fetch("/api/addFarmer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    })
    await text.json()
  }

  const handleBack=()=>{
    setUploadOptions(true);
    setText(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <header className="relative z-10 flex justify-between items-center p-6 bg-white/80 backdrop-blur-sm border-b border-purple-200 shadow-sm">
        <div className="flex items-center space-x-3">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
            {t("title")}
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-black rounded-lg p-1 relative z-[10000]">
            {icon && (
          <button onClick={() => setShowWeather(true)}>
            <img src={icon} alt="weather icon" className="w-12 h-12" />
          </button>
        )}

        {weather && showWeather &&
        createPortal(
        <div className="fixed top-16 right-0 bg-white shadow-xl rounded-xl p-6 w-64 border border-purple-200 z-[9999]">
          <div className="absolute top-2 right-2"><button onClick={()=>setShowWeather(false)}>✖</button></div>
          <div className="flex">
            <img src={icon} alt="weather icon" />
            <strong>{weather.description}</strong>
          </div>
          <div className="flex flex-col space-y-2 text-purple-600">
            <p><strong>Location</strong> : {loc}</p>
            <p>💧 : {weather.humidity}</p>
            <p>🌡️ : {weather.temp}</p>
          </div>
        </div>,document.body
        )
        }

  
            <button onClick={() => changeLanguage("en")} className="px-4 py-2 rounded-md font-medium transition-all duration-200 hover:bg-white hover:shadow-sm text-white hover:text-purple-600">English</button>
            <button onClick={() => changeLanguage("hi")} className="px-4 py-2 rounded-md font-medium transition-all duration-200 hover:bg-white hover:shadow-sm text-white hover:text-purple-600">हिंदी</button>
          </div>
          <button onClick={() => signOut({ callbackUrl: "/" })} className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">{t("sgnO")}</button>
        </div>
      </header>

      <div className="relative z-10 container mx-auto px-6 py-8">
        {pin && (
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-12">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-purple-200 max-w-md w-full transform hover:scale-105 transition-all duration-300">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{t("pincode")}</h3>
                </div>

                <div className="flex justify-center space-x-2 mb-6">
                  {Array.from({ length: 6 }, (_, i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength={1}
                      ref={inputRefs[i]}
                      onChange={(e) => handleChange(e, i)}
                      className="w-12 h-12 text-center text-xl font-bold border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 bg-purple-50 text-purple-800"
                    />
                  ))}
                </div>

                <button onClick={handleSubmit} className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-bold text-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">{t(proceed)}</button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-slide-up-1">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{t("h1")}</h3>
                <p className="text-gray-600 text-sm">{t("f1")}</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-slide-up-2">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12,3.25C12,3.25 6,10 6,14C6,17.32 8.69,20 12,20A6,6 0 0,0 18,14C18,10 12,3.25 12,3.25M14.47,9.97L15.53,11.03L9.53,17.03L8.47,15.97M9.75,10A1.25,1.25 0 0,1 11,11.25A1.25,1.25 0 0,1 9.75,12.5A1.25,1.25 0 0,1 8.5,11.25A1.25,1.25 0 0,1 9.75,10M14.25,14.5A1.25,1.25 0 0,1 15.5,15.75A1.25,1.25 0 0,1 14.25,17A1.25,1.25 0 0,1 13,15.75A1.25,1.25 0 0,1 14.25,14.5Z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{t("h2")}</h3>
                <p className="text-gray-600 text-sm">{t("f2")}</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-slide-up-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{t("h3")}</h3>
                <p className="text-gray-600 text-sm">{t("f3")}</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-slide-up-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{t("h4")}</h3>
                <p className="text-gray-600 text-sm">{t("f4")}</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-8 text-white shadow-2xl">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-3xl font-bold mb-4">{t("down1")}</h3>
                  <p className="text-purple-100 mb-6 text-lg leading-relaxed">{t("down")}</p>
                  <div className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <span className="text-sm">{t("accurate")}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                      <span className="text-sm">{t("eff")}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <span className="text-sm">{t("smart")}</span>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <img
                    src="/down.webp"
                    alt="AI Agriculture Technology"
                    className="rounded-xl shadow-lg w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent rounded-xl"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {loading && !uploadOptions && (
          <div className="flex flex-col justify-center items-center h-40 animate-pulse">
            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-6 text-xl font-bold text-purple-600">{t("processing")}</p>
            <p className="text-purple-500 mt-2">Analyzing your location data...</p>
          </div>
        )}

        {uploadOptions && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">{t("queries")}</h2>
              <p className="text-xl text-gray-600">{t("choose")}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-purple-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-slide-in-1">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">{t("text")}</h3>
                  <p className="text-gray-600 mb-6">{t("writeText")}</p>
                  <button onClick={handleText} className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-bold hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl">{t("startTyping")}</button>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-xl border border-purple-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-slide-in-2">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">{t("audio")}</h3>
                  <p className="text-gray-600 mb-6">{t("recordAudio")}</p>
                  <button onClick={() => router.push("/Audio")} className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-bold hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl">{t("startSpeaking")}</button>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-xl border border-purple-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-slide-in-3">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">{t("images")}</h3>
                  <p className="text-gray-600 mb-6">{t("uploadImage")}</p>
                  <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-bold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl" onClick={()=>router.push('/UploadImage')}>{t("startUploading")}</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {text && (
          <div className="max-w-2xl mx-auto animate-fade-in">
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-purple-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">{t("ask")}</h3>
              <div className="space-y-4">
                <textarea
                  ref={txt}
                  placeholder={t("placeholder")}
                  className="w-full p-4 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 resize-none h-32 text-gray-700"
                />
                <button onClick={handleTextSubmission} className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-bold hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl">{t("getResp")}</button>
              </div>
            </div>
            <button className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg py-3 px-4 m-4" onClick={()=>handleBack()}>{t("goBack")}</button>
          </div>
        )}
      </div>
    </div>
  )
}