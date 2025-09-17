"use client"
import { useState, useRef } from "react"

export default function AudioRecorder() {
  const [recording, setRecording] = useState(false)
  const [text,setText] = useState("");
  const [audioURL, setAudioURL] = useState("")
  const [loading, setLoading] = useState(false)
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])

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
        try {
          const res = await fetch("/api/audioTranscribe", {
            method: "POST",
            body: formData,
          })

          if (!res.ok) {
            throw new Error(`Server error: ${res.status}`)
          }

          const data = await res.json()
          console.log("Transcribed text:", data.text)
          setText(data.text);
          setAudioURL(URL.createObjectURL(blob))
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        {/* Main Card */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 p-8 backdrop-blur-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 715 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Voice Recorder</h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Record your voice and get instant transcription
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
                  <span>Stop Recording</span>
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
                  <span>Start Recording</span>
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
                <p className="text-blue-700 dark:text-blue-300 font-medium">Processing audio...</p>
              </div>
            </div>
          )}

          {/* Audio Player */}
          {audioURL && !loading && (
            <div className="mb-6">
              <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4 border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" 
                      fill="currentColor" 
                      viewBox="0 0 20 20" 
                      className="w-4 h-4 text-white">
                      <path fillRule="evenodd" 
                            d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zm6.274 3.267a1 1 0 011.414 0A9.972 9.972 0 0119 12a9.972 9.972 0 01-1.929 5.657 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 12c0-1.594-.471-3.078-1.343-4.243a1 1 0 010-1.414z" 
                            clipRule="evenodd" />
                    </svg>
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
                  <svg xmlns="http://www.w3.org/2000/svg" 
       fill="currentColor" 
       viewBox="0 0 20 20" 
       className="w-4 h-4 text-white">
    <path fillRule="evenodd" 
          d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm4 0H9v2h2V9zm4 0h-2v2h2V9z" 
          clipRule="evenodd" />
  </svg>
                </div>
                <span className="text-purple-800 dark:text-purple-200 font-semibold">Transcription</span>
              </div>
              <div className="text-purple-700 dark:text-purple-300 leading-relaxed font-medium">{text}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}