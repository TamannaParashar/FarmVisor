import i18n from "@/i18n"
import { NextResponse } from "next/server"

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY

export async function POST(req) {
  try {
    const { pincode,lang="en" } = await req.json()

    // Getting lat/lon from OpenStreetMap Nominatim
    const latlong = await fetch(
      `https://nominatim.openstreetmap.org/search?postalcode=${pincode}&country=India&format=json`,
      { headers: { "User-Agent": "FarmerAdvisorySystem/1.0" } }
    )
    if (!latlong.ok) {
      return NextResponse.json({ error: "Failed to fetch the location" }, { status: latlong.status })
    }

    const data = await latlong.json()
    if (!data || data.length === 0) {
      return NextResponse.json({ error: "Can't find location for given pincode" }, { status: 404 })
    }
    const { lat, lon, display_name } = data[0]

    //Getting weather data from OpenWeatherMap
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=${lang}`
    )
    if (!weatherRes.ok) {
      const errData = await weatherRes.json()
      return NextResponse.json({ error: errData.message || "Failed to fetch weather data" }, { status: weatherRes.status })
    }

    const weatherData = await weatherRes.json()
    if (!weatherData.main) {
      return NextResponse.json({ error: "Weather data unavailable" }, { status: 500 })
    }

    const iconCode = weatherData.weather[0].icon
    const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`

    return NextResponse.json({
      location: display_name,lat,lon,
      weather: {
        temp: weatherData.main.temp,
        humidity: weatherData.main.humidity,
        description: weatherData.weather[0].description,
        icon:iconUrl,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
  }
}