import { NextRequest, NextResponse } from "next/server";
import { getWeatherByCity } from "@/lib/weather";

// GET /api/weather?city=Jakarta
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const city = searchParams.get("city");

  if (!city) {
    return NextResponse.json(
      {
        success: false,
        error: "parameter 'city' wajib diisi, contoh /api/weather?city=Jakarta",
      },
      { status: 400 },
    );
  }

  try {
    const weatherData = await getWeatherByCity(city);
    return NextResponse.json(
      {
        success: true,
        data: weatherData,
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
