"use client"
import { useState, useRef } from "react"

export default function AudioRecorder() {
  const [recording, setRecording] = useState(false)
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
        chunksRef.current = [] // reset for next recording

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
    <div className="p-4">
      <button
        onClick={recording ? stopRecording : startRecording}
        className="px-4 py-2 bg-green-600 text-white rounded-md"
        disabled={loading}
      >
        {recording ? "Stop Recording" : "Start Recording"}
      </button>

      {loading && <p className="mt-2 text-blue-600">Processing audio...</p>}

      {audioURL && !loading && (
        <div className="mt-4">
          <audio controls src={audioURL}></audio>
        </div>
      )}
    </div>
  )
}