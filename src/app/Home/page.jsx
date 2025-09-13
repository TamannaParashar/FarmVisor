"use client"
import { useTranslation } from "react-i18next"
import i18n from "./../../i18n"
import { signOut } from "next-auth/react"
import { useRef } from "react"

export default function Home() {
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
}
  return (
    <div>
        <div className="flex float-right">
        <button onClick={()=>signOut({callbackUrl:'/'})} className="p-3 rounded-lg font-bold">SignOut</button>
      <div className="mb-4">
        <button onClick={() => changeLanguage("en")} className="px-3 py-1 border mr-2">
          English
        </button>
        <button onClick={() => changeLanguage("hi")} className="px-3 py-1 border">
          हिंदी
        </button>
      </div>
      </div>

      <h2 className="text-xl font-bold text-center m-4">{t("pincode")}</h2>
      <div className="flex justify-center align-middle">
        {Array.from({ length: 6 }, (_, i) => (
          <input key={i} type="text" maxLength={1} ref={inputRefs[i]} onChange={(e) => handleChange(e, i)}
            className="w-12 p-3 m-2 rounded-lg text-white font-bold bg-purple-600 text-center"
          />
        ))}
        <div><button onClick={handleSubmit}>{t("done")}</button></div>
      </div>
    </div>
  )
}