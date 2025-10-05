"use client"
import i18n from "./../../i18n"
import { useState, useRef, useCallback } from "react"
import { Upload, X, ImageIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import ReactMarkdown from "react-markdown"

export default function UploadImage({
  onImageSelect,
  maxSize = 5,
  acceptedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"],
}) {
  const [dragActive, setDragActive] = useState(false)
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false);
  const [proceedAllowed,setProceedAllowed] = useState(true);
  const [showDetection,setShowDetection] = useState(true)
  const [cropDisease,setCropDisease] = useState("")
  const [showInfo,setShowInfo] = useState(false)
  const [confidence,setConfidence] = useState("")
  const [info,setInfo] = useState("")
  const inputRef = useRef(null)

  const {t} = useTranslation();
  const changeLanguage = (lang)=>{
    i18n.changeLanguage(lang);
  }

  const handleFiles = useCallback(
    (files) => {
      if (!files || files.length === 0) return

      const file = files[0]
      setError(null)

      if (!acceptedTypes.includes(file.type)) {
        setError(t("invalidFileType"))
        return
      }

      if (file.size > maxSize * 1024 * 1024) {
        setError(t("fileTooLarge",{maxSize}))
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result)
      }
      reader.readAsDataURL(file)
      onImageSelect?.(file)
    },
    [acceptedTypes, maxSize, onImageSelect],
  )

  const infoRef = useRef(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles],
  )

  const handleChange = useCallback(
    (e) => {
      handleFiles(e.target.files)
    },
    [handleFiles],
  )

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleSubmit=async()=>{
    setLoading(true);
    if(!preview){
        return;
    }
    const image = inputRef.current.files[0];

    const formdata = new FormData();
    formdata.append("image",image);
    try {
    const res = await fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      body: formdata,
    })
    const data = await res.json()
    setConfidence(data.confidence)
    setCropDisease(data.class);
    document.body.style.backgroundColor='white'
    const getCrop = await fetch('/api/detectedDisease',{
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ class: data.class,lang:i18n.language })

    })
    const diseaseRes = await getCrop.json()
    setInfo(diseaseRes.cropDiseaseResp)
  } catch (err) {
    console.error(err)
    alert("Error while predicting")
  } finally {
  setLoading(false);
  }
  }
  console.log("Confidence percentage:",confidence)

  const handleCropInfo=()=>{
    setShowDetection(false);
    setShowInfo(true);
    setProceedAllowed(false);
    setTimeout(() => {
        infoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  const clearPreview = () => {
    setPreview(null)
    setError(null)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  return (
    <div>
      <div className="flex justify-end">
        <div className="bg-black rounded-md p-1">
        <button onClick={() => changeLanguage("en")} className="px-4 py-2 rounded-md font-medium transition-all duration-200 bg-black hover:bg-white hover:shadow-sm text-white hover:text-purple-600">English</button>
        <button onClick={() => changeLanguage("hi")} className="px-4 py-2 rounded-md font-medium transition-all duration-200 bg-black hover:bg-white hover:shadow-sm text-white hover:text-purple-600">हिंदी</button>
        <button onClick={() => changeLanguage("kn")} className="px-4 py-2 rounded-md font-medium transition-all duration-200 hover:bg-white hover:shadow-sm text-white hover:text-purple-600">ಕನ್ನಡ</button>
        </div>
      </div>

      {loading && !showDetection && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <p className="text-2xl text-white">{t("loading")}</p>
          <div className="flex space-x-2 mt-6">
          <div className="w-6 h-6 bg-white/40 rounded-full animate-pulse" style={{animationDelay: '0s', animationDuration: '1.5s'}}></div>
          <div className="w-6 h-6 bg-white/40 rounded-full animate-pulse" style={{animationDelay: '0.5s', animationDuration: '1.5s'}}></div>
          <div className="w-6 h-6 bg-white/40 rounded-full animate-pulse" style={{animationDelay: '1s', animationDuration: '1.5s'}}></div>
        </div>
      </div> )}

      <div className="w-full max-w-md mx-auto items-center mt-4">
        <div className={`relative border-2 border-dashed rounded-lg transition-all duration-200 cursor-pointer group 
          ${dragActive ? "border-purple-600 bg-purple-50 scale-105" : "border-gray-400 hover:border-purple-400 hover:bg-gray-100"} 
          ${error ? "border-red-500 bg-red-50" : ""}`}
          onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
          onClick={handleClick}>
          
          <input ref={inputRef} type="file" accept={acceptedTypes.join(",")} onChange={handleChange} className="hidden" />
          
          {preview ? (
            <div className="relative p-4">
              <img src={preview || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover rounded-md" />
              <button
                onClick={(e) => { e.stopPropagation(); clearPreview() }}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="mx-auto w-12 h-12 mb-4 text-gray-500 group-hover:text-purple-600 transition-colors">
                {dragActive ? (
                  <Upload className="w-full h-full animate-bounce" />
                ) : (
                  <ImageIcon className="w-full h-full" />
                )}
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-black">
                  {dragActive ? t("dropImageHere") : t("uploadImage")}
                </p>
                <p className="text-xs text-gray-500">{t("dragDropOrClick")}</p>
                <p className="text-xs text-gray-500">{t("supportedFormats", { maxSize })}</p>
              </div>
            </div>
          )}
        </div>

        {proceedAllowed && <div className="flex justify-center items-center mb-2">
          <button className="px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg text-white" onClick={handleSubmit}>
            {t("proceed")}
          </button>
        </div>}

        {error && <p className="mt-2 text-sm text-red-600 text-center">{error}</p>}
      </div>

      {cropDisease && showDetection && (
        <div className="fixed inset-0 bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 flex flex-col justify-center items-center backdrop-blur-sm">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 max-w-md mx-4 shadow-2xl">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              <h3 className="text-xl font-bold text-white mb-3">{t("diseaseDetected")}</h3>
              <p className="text-white/90 leading-relaxed">
                {t("detectedDiseaseText", { disease: cropDisease })}
              </p>
              <button className="bg-white px-4 py-3 rounded-lg text-black cursor-pointer" onClick={handleCropInfo}>{t("yes")}</button>

              <div className="flex justify-center space-x-2 mt-6">
                <div className="w-6 h-6 bg-white/40 rounded-full animate-pulse" style={{animationDelay: '0s', animationDuration: '1.5s'}}></div>
                <div className="w-6 h-6 bg-white/40 rounded-full animate-pulse" style={{animationDelay: '0.5s', animationDuration: '1.5s'}}></div>
                <div className="w-6 h-6 bg-white/40 rounded-full animate-pulse" style={{animationDelay: '1s', animationDuration: '1.5s'}}></div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div ref={infoRef} className="m-5 border-2 border-white rounded-lg bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 text-white">
      {info && showInfo && <ReactMarkdown>{info}</ReactMarkdown>}
      </div>
    </div>
  )
}