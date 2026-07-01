import { NextRequest, NextResponse } from "next/server";
import { getNewsByCategory } from "@/lib/news";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get("category") || "general";

  const validCategories = [
    "business",
    "entertainment",
    "general",
    "health",
    "science",
    "sports",
    "technology",
  ];

  if (!validCategories.includes(category)) {
    return NextResponse.json(
      {
        succsess: false,
        error: `Kategori "${category}" tidak valid. Pilihan: ${validCategories.join(", ")}`,
      },
      { status: 400 },
    );
  }

  try {
    const newsData = await getNewsByCategory(category);
    return NextResponse.json(
      {
        succsess: true,
        data: newsData,
      },
      { status: 200 },
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Terjadi kesalahan tidak terduga";
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 },
    );
  }
}
