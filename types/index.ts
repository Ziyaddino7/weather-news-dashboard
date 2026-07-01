// ============================================================
// TIPE DATA CUACA (dari OpenWeatherMap API)
// ============================================================

// Data cuaca saat ini untuk satu kota

export interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  description: string; // Deskripsi cuaca, contoh: "scattered clouds"
  icon: string; // Kode ikon cuaca, contoh: "03d"
  iconUrl: string; // URL lengkap ikon, contoh: "https://openweathermap.org/img/wn/03d@2x.png"
  sunrise: number; // Waktu matahari terbit (Unix timestamp)
  sunset: number; // Waktu matahari terbenam (Unix timestamp)
}

// Data cuaca untuk SATU titik waktu dalam ramalan 5 hari
export interface ForecastItem {
  datetime: string; // Waktu ramalan dalam format ISO 8601, contoh:contoh: "2024-01-15 12:00:00"
  temperature: number;
  feelsLike: number; //suhu yang dirasakan
  humidity: number; // persentase kelembapan
  windSpeed: number;
  description: string; // Deskripsi cuaca saat itu
  icon: string; // Kode ikon saat itu
  iconUrl: string; // URL ikon saat itu
}

// Data ramalan cuaca 5 hari (berisi banyak ForecastItem)
export interface ForecastData {
  city: string; // Nama kota
  country: string; // Kode negara
  list: ForecastItem[]; // Array ramalan ([] artinya list/array)
}

// ============================================================
// TIPE DATA BERITA (dari NewsAPI)
// ============================================================

// Data satu artikel berita
export interface NewsArticle {
  title: string; // Judul berita
  description: string; // Ringkasan berita
  url: string; // Link ke artikel asli
  imageUrl: string; // Link foto/thumbnail berita
  source: string; // Nama sumber berita, contoh: "BBC News"
  publishedAt: string; // Tanggal terbit, contoh: "2024-01-15T10:30:00Z"
}

// Format standar response sukses dari API Route kita
export interface ApiResponse<T> {
  success: boolean; // true jika berhasil, false jika gagal
  data: T; // Data yang dikembalikan (tipenya fleksibel)
}

// Format standar response error dari API Route kita
export interface ApiError {
  success: boolean; // Selalu false jika error
  error: string; // Pesan error, contoh: "City not found"
}
