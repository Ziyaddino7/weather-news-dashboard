// app/api/forecast/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getForecastByCity } from "@/lib/weather";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const city = searchParams.get("city");

  if (!city) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Parameter 'city' wajib diisi. Contoh: /api/forecast?city=Jakarta",
      },
      { status: 400 },
    );
  }

  try {
    const forecastData = await getForecastByCity(city);

    return NextResponse.json(
      {
        success: true,
        data: forecastData,
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
