import { NewsArticle } from "@/types";
const BASE_URL = "https://newsapi.org/v2";
const API_KEY = process.env.NEWS_API_KEY;

// FUNGSI: Ambil berita berdasarkan kategori
export async function getNewsByCategory(
  category: string = "general", // Kalau tidak ada kategori, default ke "general"
): Promise<NewsArticle[]> {
  if (!API_KEY) {
    throw new Error("NEWS_API_KEY belum diisi di file .env.local");
  }
  const url = `${BASE_URL}/top-headlines?category=${category}&pageSize=10&apiKey=${API_KEY}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Gagal mengambil berita. Status: ${response.status}`);
  }

  const data = await response.json();

  // data.articles berisi array berita mentah dari NewsAPI
  // Kita filter dulu untuk buang artikel yang judulnya "[Removed]"
  // (NewsAPI kadang mengembalikan artikel yang sudah dihapus)
  const articles: NewsArticle[] = data.articles
    .filter((article: any) => article.title !== "[Removed]")
    .map((article: any) => ({
      title: article.title || "Judul tidak tersedia",
      description: article.description || "Deskripsi tidak tersedia",
      url: article.url,
      // Kalau tidak ada gambar, kita kasih gambar placeholder
      imageUrl:
        article.urlToImage || "https://placehold.co/600x400?text=No+Image",
      source: article.source?.name || "Sumber tidak diketahui",
      publishedAt: article.publishedAt,
    }));

  return articles;
}
