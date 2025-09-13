"use client"
import { useTranslation } from "react-i18next"
import i18n from "./../../i18n"
import { signOut } from "next-auth/react"
import { useRef, useState } from "react"

export default function Home() {
  const [pin,setPin] = useState(true);
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
  const res = await fetch('/api/locationWeather',{
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pincode }),
  });
  const data = await res.json();
  console.log(data);
  setPin(false);
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
    </div>
  )
}