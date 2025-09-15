"use client"
import { useTranslation } from "react-i18next"
import i18n from "./../../i18n"
import { signOut } from "next-auth/react"
import { useRef, useState } from "react"
import '../style.css'
export default function Home() {
  const [pin,setPin] = useState(true);
  const [loading, setLoading] = useState(false)
  const [uploadOptions,setUploadOptions] = useState(false);
  const [text,setText] = useState(false);

  const { t } = useTranslation()
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang)
  }

  const inputRefs = Array.from({ length: 6 }, () => useRef(null))
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
const handleSubmit= async()=>{
  const pincode = inputRefs.map(ref => ref.current?.value || "").join("")
  setLoading(true)
  try{
  const res = await fetch('/api/locationWeather',{
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pincode }),
  });
  const data = await res.json();
  console.log(data);
  setPin(false);
  setUploadOptions(true);
  }finally{
    setLoading(false);
  }
}

const handleText=()=>{
    setUploadOptions(false)
    setText(true);
}

const txt = useRef(null);

const handleTextSubmission=async()=>{
    const query = txt.current.value;
    const text = await fetch('/api/addFarmer',{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
    });
    await text.json();
}
  return (
    <div>
      <div className="mb-4">
        <button onClick={()=>signOut({callbackUrl:'/'})} className="px-3 py-1 border-2 border-purple-600 rounded-lg font-bold mr-2">SignOut</button>
        <button onClick={() => changeLanguage("en")} className="px-3 py-1 border-2 border-purple-600 ro rounded-lg font-bold mr-2">English</button>
        <button onClick={() => changeLanguage("hi")} className="px-3 py-1 border-2 border-purple-600 ro rounded-lg font-bold mr-2">हिंदी</button>
      </div>
      {pin && <div className="flex justify-center">
      <div className="border-2 border-purple-600 bg-gradient-to-r from-purple-600 to-black w-[50%]">
      <h2 className="text-xl font-bold text-center m-4 text-white">{t("pincode")}</h2>
      <div className="flex justify-center align-middle">
        {Array.from({ length: 6 }, (_, i) => (
          <input key={i} type="text" maxLength={1} ref={inputRefs[i]} onChange={(e) => handleChange(e, i)}
            className="w-12 p-3 m-2 rounded-lg text-white font-bold bg-purple-600 text-center border-2 border-white"
          />
        ))}
        </div>
        <div><button onClick={handleSubmit} className="bg-white text-black rounded-lg shadow-lg p-2 m-5 flex justify-center items-center">{t("done")}</button></div>
      </div>
      </div>}

      {loading && !uploadOptions && (
        <div className="flex flex-col justify-center items-center h-40">
            <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-lg font-bold text-purple-600">
            {t("processing")}
            </p>
        </div>
        )}

      {uploadOptions &&
      <div className="flex flex-col items-center space-y-6 mt-8">
        <h1 className="animate-slide-in-1 flex items-center justify-center w-80 h-20 bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group text-white text-xl font-bold">{t("ask")}</h1>
  {/* Text Option */}
        <div className="animate-slide-in-2 flex items-center justify-center w-80 h-20 bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
            <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
            </div>
            <button className="text-white text-xl font-bold" onClick={handleText}>{t("text")}</button>
            </div>
        </div>

        {/* Audio Option */}
        <div className="animate-slide-in-3 flex items-center justify-center w-80 h-20 bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
            <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.617 14H2a1 1 0 01-1-1V7a1 1 0 011-1h2.617l3.766-2.793a1 1 0 011.617.793zm7.447 2.171a1 1 0 011.414 0A9.972 9.972 0 0120 10a9.972 9.972 0 01-1.756 4.753 1 1 0 11-1.788-.894A7.973 7.973 0 0018 10a7.973 7.973 0 00-1.544-3.859 1 1 0 010-1.414zM15.264 5.93a1 1 0 011.414 0 5.984 5.984 0 010 8.14 1 1 0 11-1.414-1.414 3.984 3.984 0 000-5.312 1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </div>
            <button className="text-white text-xl font-bold">{t("audio")}</button>
            </div>
        </div>

        {/* Images Option */}
        <div className="animate-slide-in-4 flex items-center justify-center w-80 h-20 bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
            <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
            </div>
            <button className="text-white text-xl font-bold">{t("images")}</button>
            </div>
        </div>
        </div>
      }
      {text &&
      <div>
      <input type="text" name="txt" id="txt" ref={txt} placeholder="Enter your query" />
      <button onClick={handleTextSubmission}>Done</button></div>
      }
    </div>
  )
}