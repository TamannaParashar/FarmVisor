"use client"

import axios from "axios"
import { useState } from "react"
import Link from "next/link"

export default function News() {
    const [articles,setArticles] = useState([])
    const getNews=async()=>{
        const res = await axios.get('https://newsapi.org/v2/top-headlines?country=us&apiKey=4ebcff63fedf40308aaba540262a28b7')
        setArticles(res.data.articles);
    }
  return (
    <div>
        <div>
        <button onClick={getNews}>Get news</button>
        </div>
       <div className="space-y-8">
        {articles.map((val,idx)=>{
            return(
            <div key={idx} >
            <h2 className="text-2xl font-bold m-5 break-words text-center">{val.title}</h2>
            <div className="flex justify-center">
            {val.urlToImage && <img src={val.urlToImage} alt="no img found" className="w-xl rounded-lg" />}
            </div>
            <div className="flex justify-center">
                <Link href={val.url} className="text-blue-500 text-xl">More...</Link>
            </div>
            </div>
            )
        })}
       </div>
    </div>
  )
}
