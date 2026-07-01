# Weather & News Dashboard API Documentation

Dokumentasi API backend untuk integrasi dengan frontend Next.js di project `weather-news-dashboard`.

## Ringkasan

Project ini menyediakan dua endpoint utama untuk mengambil data cuaca dan berita dari layanan eksternal. API diimplementasikan sebagai route Next.js di folder `app/api/*`.

---

## Endpoint Cuaca

### GET /api/weather

Menarik data cuaca saat ini untuk satu kota.

#### Query Parameter

- `city` (string, wajib): nama kota yang ingin diambil datanya.

#### Contoh Request

`GET /api/weather?city=Jakarta`

#### Contoh Response Success (200)

```json
{
  "success": true,
  "data": {
    "city": "Jakarta",
    "country": "ID",
    "temperature": 30,
    "feelsLike": 32,
    "humidity": 68,
    "windSpeed": 3.2,
    "description": "scattered clouds",
    "icon": "03d",
    "iconUrl": "https://openweathermap.org/img/wn/03d@2x.png",
    "sunrise": 1712100000,
    "sunset": 1712143200
  }
}
```

#### Contoh Response Error (400)

```json
{
  "success": false,
  "error": "parameter 'city' wajib diisi, contoh /api/weather?city=Jakarta"
}
```

#### Contoh Response Error (500)

```json
{
  "success": false,
  "error": "Terjadi kesalahan tidak terduga"
}
```

---

## Endpoint Forecast Cuaca

### GET /api/forecast

Menarik ramalan cuaca untuk 5 hari ke depan untuk satu kota.

#### Query Parameter

- `city` (string, wajib): nama kota.

#### Contoh Request

`GET /api/forecast?city=Jakarta`

#### Contoh Response Success (200)

```json
{
  "success": true,
  "data": {
    "city": "Jakarta",
    "country": "ID",
    "list": [
      {
        "datetime": "2026-07-01 12:00:00",
        "temperature": 30,
        "feelsLike": 33,
        "humidity": 70,
        "windSpeed": 3.5,
        "description": "light rain",
        "icon": "10d",
        "iconUrl": "https://openweathermap.org/img/wn/10d@2x.png"
      }
    ]
  }
}
```

#### Contoh Response Error (400)

```json
{
  "success": false,
  "error": "Parameter 'city' wajib diisi. Contoh: /api/forecast?city=Jakarta"
}
```

#### Contoh Response Error (500)

```json
{
  "success": false,
  "error": "Terjadi kesalahan tidak terduga"
}
```

---

## Endpoint Berita

### GET /api/news

Mengambil daftar artikel berita berdasarkan kategori.

#### Query Parameter

- `category` (string, optional): kategori berita.
  - default: `general`
  - nilai valid:
    - `business`
    - `entertainment`
    - `general`
    - `health`
    - `science`
    - `sports`
    - `technology`

#### Contoh Request

`GET /api/news?category=technology`

#### Perhatian

API route `app/api/news/route.ts` mendefinisikan field respons `succsess` pada respons sukses. Frontend saat ini membaca nilai `success` atau `succsess`, sehingga kedua bentuk ditangani.

#### Contoh Response Success (200)

```json
{
  "succsess": true,
  "data": [
    {
      "title": "Contoh Judul Berita",
      "description": "Ringkasan berita singkat.",
      "url": "https://example.com/article",
      "imageUrl": "https://example.com/image.jpg",
      "source": "BBC News",
      "publishedAt": "2026-06-30T08:00:00Z"
    }
  ]
}
```

#### Contoh Response Error (400)

```json
{
  "succsess": false,
  "error": "Kategori \"invalid\" tidak valid. Pilihan: business, entertainment, general, health, science, sports, technology"
}
```

#### Contoh Response Error (500)

```json
{
  "success": false,
  "error": "Terjadi kesalahan tidak terduga"
}
```

---

## Struktur Data Utama

### WeatherData

- `city`: string
- `country`: string
- `temperature`: number
- `feelsLike`: number
- `humidity`: number
- `windSpeed`: number
- `description`: string
- `icon`: string
- `iconUrl`: string
- `sunrise`: number
- `sunset`: number

### ForecastData

- `city`: string
- `country`: string
- `list`: ForecastItem[]

### ForecastItem

- `datetime`: string
- `temperature`: number
- `feelsLike`: number
- `humidity`: number
- `windSpeed`: number
- `description`: string
- `icon`: string
- `iconUrl`: string

### NewsArticle

- `title`: string
- `description`: string
- `url`: string
- `imageUrl`: string
- `source`: string
- `publishedAt`: string

---

## Integrasi Frontend

Frontend Next.js di `app/page.tsx` memanggil:

- `/api/weather?city=${activeCity}`
- `/api/forecast?city=${activeCity}`
- `/api/news?category=${activeCategory}`

Dan mengharapkan respons objek JSON dengan property `success` atau `succsess` plus `data`.
