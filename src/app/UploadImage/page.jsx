"use client"

import { useState, useRef, useCallback } from "react"
import { Upload, X, ImageIcon } from "lucide-react"

export default function UploadImage({
  onImageSelect,
  maxSize = 5,
  acceptedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"],
}) {
  const [dragActive, setDragActive] = useState(false)
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState(null)
  const inputRef = useRef(null)

  const handleFiles = useCallback(
    (files) => {
      if (!files || files.length === 0) return

      const file = files[0]
      setError(null)

      if (!acceptedTypes.includes(file.type)) {
        setError("Please select a valid image file (JPEG, PNG, WebP, or GIF)")
        return
      }

      if (file.size > maxSize * 1024 * 1024) {
        setError(`File size must be less than ${maxSize}MB`)
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
    alert(`Prediction: ${data.class} (Confidence: ${(data.confidence * 100).toFixed(2)}%)`)
  } catch (err) {
    console.error(err)
    alert("Error while predicting")
  }
  }

  const clearPreview = () => {
    setPreview(null)
    setError(null)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  return (
    <div className={"w-full max-w-md mx-auto items-center max-h-screen mt-4"}>
      <div
        className={`relative border-2 border-dashed rounded-lg transition-all duration-200 cursor-pointer group
          ${dragActive ? "border-purple-600 bg-purple-50 scale-105" : "border-gray-400 hover:border-purple-400 hover:bg-gray-100"}
          ${error ? "border-red-500 bg-red-50" : ""}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input ref={inputRef} type="file" accept={acceptedTypes.join(",")} onChange={handleChange} className="hidden" />

        {preview ? (
           <div>
          <div className="relative p-4">
            <img src={preview || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover rounded-md" />
            <button
              onClick={(e) => {e.stopPropagation();clearPreview()}}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"><X size={16} /></button>
          </div>
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
                {dragActive ? "Drop your image here" : "Upload an image"}
              </p>
              <p className="text-xs text-gray-500">Drag and drop or click to browse</p>
              <p className="text-xs text-gray-500">Supports JPEG, PNG, WebP, GIF up to {maxSize}MB</p>
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-center items-center mb-2">
            <button className="px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg text-white" onClick={handleSubmit}>Proceed</button>
        </div>
      {error && <p className="mt-2 text-sm text-red-600 text-center">{error}</p>}
    </div>
  )
}
