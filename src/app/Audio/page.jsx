"use client"
import { useState, useRef, useEffect } from "react"
import { MicrophoneIcon, PlayIcon, ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/solid"
import i18n from "./../../i18n";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";

export default function AudioRecorder() {
  const [recording, setRecording] = useState(false)
  const [text,setText] = useState("");
  const [audioURL, setAudioURL] = useState("")
  const [loading, setLoading] = useState(false)
  const [audioResp,setAudioResp] = useState("")
  const [wea,setWeather] = useState("")
  const [loc,setLoc] = useState("")

  useEffect(() => {
  const storedWeather = JSON.parse(localStorage.getItem("weather"));
  const storedLoc = localStorage.getItem("loc");
  setWeather(storedWeather);
  setLoc(storedLoc);
}, []);


  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const {t} = useTranslation();
  const changeLanguage= (lang) => {
    i18n.changeLanguage(lang);
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorderRef.current.onstop = async () => {
        setLoading(true)
        const blob = new Blob(chunksRef.current, { type: "audio/wav" })
        chunksRef.current = []
        const formData = new FormData()
        formData.append("file", blob, "farmer_audio.wav")
        formData.append("weather",JSON.stringify(wea))
        formData.append("location",loc)
        try {
          const res = await fetch("/api/audioTranscribe", {
            method: "POST",
            body: formData
          })

          if (!res.ok) {
            throw new Error(`Server error: ${res.status}`)
          }

          const data = await res.json()
          console.log("Transcribed text:", data.text)
          setText(data.text);
          setAudioURL(URL.createObjectURL(blob))
          console.log("Output:", data.audioQuery)
          setAudioResp(data.audioQuery)
        } catch (err) {
          console.error("Transcription failed:", err)
          alert("Something went wrong while transcribing audio")
        } finally {
          setLoading(false)
        }
      }

      mediaRecorderRef.current.start()
      setRecording(true)
    } catch (err) {
      console.error("Mic access denied:", err)
      alert("Please allow microphone access")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setRecording(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="flex justify-end">
        <div className="bg-black rounded-md p-1">
        <button onClick={() => changeLanguage("en")} className="px-4 py-2 rounded-md font-medium transition-all duration-200 bg-black hover:bg-white hover:shadow-sm text-white hover:text-purple-600">English</button>
        <button onClick={() => changeLanguage("hi")} className="px-4 py-2 rounded-md font-medium transition-all duration-200 bg-black hover:bg-white hover:shadow-sm text-white hover:text-purple-600">हिंदी</button>
        <button onClick={() => changeLanguage("kn")} className="px-4 py-2 rounded-md font-medium transition-all duration-200 hover:bg-white hover:shadow-sm text-white hover:text-purple-600">ಕನ್ನಡ</button>
        </div>
      </div>
    <div className="flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        {/* Main Card */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 p-8 backdrop-blur-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <MicrophoneIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">{t("recorder")}</h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              {t("recorderFollowUp")}
            </p>
          </div>

          {/* Recording Button */}
          <div className="flex justify-center mb-8">
            {recording ? (
              <button
                onClick={stopRecording}
                className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-white rounded-sm animate-pulse"></div>
                  <span>{t("stopRecord")}</span>
                </div>
              </button>
            ) : (
              <button
                onClick={startRecording}
                className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                  <span>{t("startRecord")}</span>
                </div>
              </button>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-3 px-4 py-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                </div>
                <p className="text-blue-700 dark:text-blue-300 font-medium">{t("load")}</p>
              </div>
            </div>
          )}

          {/* Audio Player */}
          {audioURL && !loading && (
            <div className="mb-6">
              <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4 border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                     <PlayIcon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Your Recording</span>
                </div>
                <audio
                  controls
                  src={audioURL}
                  className="w-full h-10 rounded-lg"
                  style={{
                    filter: "sepia(20%) saturate(70%) hue-rotate(200deg) brightness(1.2)",
                  }}
                ></audio>
              </div>
            </div>
          )}

          {/* Transcription */}
          {text && !loading && (
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <ChatBubbleLeftEllipsisIcon className="w-4 h-4 text-white" />
                </div>
                <span className="text-purple-800 dark:text-purple-200 font-semibold">Transcription</span>
              </div>
              <div className="text-purple-700 dark:text-purple-300 leading-relaxed font-medium">{text}</div>
            </div>
          )}
        </div>
      </div>
    </div>
    <div className="m-5 border-2 border-purple-600 rounded-lg">
    {audioResp && <ReactMarkdown>{audioResp}</ReactMarkdown>}
    </div>
    </div>
  )
}