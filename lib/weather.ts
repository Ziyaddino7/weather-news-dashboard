import { WeatherData, ForecastData, ForecastItem } from "@/types";

const BASE_URL = "https://api.openweathermap.org/data/2.5";
const API_KEY = process.env.OPENWEATHER_API_KEY;

// ============================================================
// FUNGSI 1: Ambil cuaca SEKARANG berdasarkan nama kota
// ============================================================
export async function getWeatherByCity(city: string): Promise<WeatherData> {
  if (!API_KEY) {
    throw new Error("OPENWEATHER_API_KEY belum diisi di file .env.local");
  }

  const url = `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric&lang=id`;

  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(
        `Kota "${city}" tidak ditemukan. Coba cek ejaan nama kotanya.`,
      );
    }
    throw new Error(`Gagal mengambil data cuaca. Status: ${response.status}`);
  }

  const data = await response.json();

  const weatherData: WeatherData = {
    city: data.name,
    country: data.sys.country,
    temperature: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    iconUrl: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
    sunrise: data.sys.sunrise,
    sunset: data.sys.sunset,
  };

  return weatherData;
}

// ============================================================
// FUNGSI 2: Ambil ramalan cuaca 5 HARI ke depan
// ============================================================
export async function getForecastByCity(city: string): Promise<ForecastData> {
  if (!API_KEY) {
    throw new Error("OPENWEATHER_API_KEY belum diisi di file .env.local");
  }

  const url = `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=id`;

  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Kota "${city}" tidak ditemukan.`);
    }
    throw new Error(`Gagal mengambil data ramalan. Status: ${response.status}`);
  }

  const data = await response.json();

  const forecastList: ForecastItem[] = data.list.map((item: any) => ({
    datetime: item.dt_txt,
    temperature: Math.round(item.main.temp),
    feelsLike: Math.round(item.main.feels_like),
    humidity: item.main.humidity,
    windSpeed: item.wind.speed,
    description: item.weather[0].description,
    icon: item.weather[0].icon,
    iconUrl: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
  }));

  return {
    city: data.city.name,
    country: data.city.country,
    list: forecastList,
  };
}
