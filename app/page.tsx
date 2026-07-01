"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Cloud,
  CloudFog,
  CloudRain,
  CloudSun,
  Droplet,
  MapPin,
  Moon,
  Sparkles,
  Sun,
  Wind,
} from "lucide-react";
import type { ForecastData, NewsArticle, WeatherData } from "@/types";

const cityOptions = ["Jakarta", "Bandung", "Surabaya", "Bali"];
const categoryOptions = [
  "general",
  "technology",
  "business",
  "health",
  "sports",
  "science",
  "entertainment",
];

const categoryLabels: Record<string, string> = {
  general: "General",
  technology: "Technology",
  business: "Business",
  health: "Health",
  sports: "Sports",
  science: "Science",
  entertainment: "Entertainment",
};

const summaryColors: Record<string, string> = {
  general: "text-slate-500",
  technology: "text-cyan-600",
  business: "text-amber-600",
  health: "text-rose-500",
  sports: "text-emerald-600",
  science: "text-violet-600",
  entertainment: "text-fuchsia-600",
};

const formatHour = (datetime: unknown) => {
  if (!datetime) return "00.00";

  const date = new Date(datetime as string | number | Date);
  if (isNaN(date.getTime())) {
    const cleanStr = String(datetime).trim();
    const hourPart = cleanStr.split(/[:.]/)[0];
    const formattedHour = hourPart.padStart(2, "0");
    return `${formattedHour}.00`;
  }

  const hour = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    hour12: false,
  }).format(date);

  return `${hour.padStart(2, "0")}.00`;
};

function normalizeCondition(description?: string) {
  return description?.trim().toLowerCase() ?? "";
}

function getWeatherSymbol(iconCode: string, description?: string) {
  const condition = normalizeCondition(description);
  const isNight = iconCode.endsWith("n");

  if (
    condition.includes("thunder") ||
    condition.includes("storm") ||
    condition.includes("lightning")
  ) {
    return { Icon: CloudRain, color: "text-slate-200" };
  }

  if (
    condition.includes("rain") ||
    condition.includes("shower") ||
    condition.includes("drizzle")
  ) {
    return { Icon: CloudRain, color: "text-slate-200" };
  }

  if (
    condition.includes("snow") ||
    condition.includes("sleet") ||
    condition.includes("ice")
  ) {
    return { Icon: CloudFog, color: "text-slate-200" };
  }

  if (
    condition.includes("fog") ||
    condition.includes("mist") ||
    condition.includes("haze") ||
    condition.includes("smoke")
  ) {
    return { Icon: CloudFog, color: "text-slate-300" };
  }

  if (condition.includes("cloud") || condition.includes("overcast")) {
    return isNight
      ? { Icon: Cloud, color: "text-slate-300" }
      : { Icon: CloudSun, color: "text-slate-200" };
  }

  if (condition.includes("clear")) {
    return isNight
      ? { Icon: Moon, color: "text-slate-200" }
      : { Icon: Sun, color: "text-amber-400" };
  }

  switch (iconCode) {
    case "01d":
      return { Icon: Sun, color: "text-amber-400" };
    case "01n":
      return { Icon: Moon, color: "text-slate-200" };
    case "02d":
    case "03d":
    case "04d":
      return { Icon: CloudSun, color: "text-slate-200" };
    case "02n":
    case "03n":
    case "04n":
      return { Icon: Cloud, color: "text-slate-300" };
    case "09d":
    case "09n":
    case "10d":
    case "10n":
      return { Icon: CloudRain, color: "text-slate-200" };
    case "11d":
    case "11n":
      return { Icon: CloudRain, color: "text-slate-300" };
    case "13d":
    case "13n":
      return { Icon: CloudFog, color: "text-slate-300" };
    default:
      return { Icon: Sun, color: "text-amber-400" };
  }
}

function getWeatherContainerClass() {
  return "relative overflow-hidden rounded-[2rem] border border-white/10 p-6 shadow-sm bg-cover bg-center bg-no-repeat text-white";
}

function getWeatherBackgroundImage(iconCode?: string) {
  const dayImage = "/images/bromo-day.png";
  const nightImage = "/images/bromo-night.png";

  if (!iconCode) {
    return nightImage;
  }

  return iconCode.trim().toLowerCase().endsWith("n") ? nightImage : dayImage;
}

function getGlassCardClass() {
  return "rounded-3xl border border-white/[0.08] bg-white/[0.06] backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] transition-all duration-300 hover:bg-white/[0.08]";
}

function getGlassSectionClass() {
  return "rounded-[2rem] border border-white/20 bg-white/80 p-6 shadow-sm backdrop-blur-2xl";
}

export default function Home() {
  const [activeCity, setActiveCity] = useState("Jakarta");
  const [activeCategory, setActiveCategory] = useState("general");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      setLoading(true);
      setError(null);
      try {
        const [weatherRes, forecastRes, newsRes] = await Promise.all([
          fetch(`/api/weather?city=${encodeURIComponent(activeCity)}`),
          fetch(`/api/forecast?city=${encodeURIComponent(activeCity)}`),
          fetch(`/api/news?category=${encodeURIComponent(activeCategory)}`),
        ]);

        const weatherJson = await weatherRes.json();
        const forecastJson = await forecastRes.json();
        const newsJson = await newsRes.json();

        if (!weatherRes.ok || !weatherJson.success) {
          throw new Error(weatherJson.error || "Gagal memuat data cuaca");
        }

        if (!forecastRes.ok || !forecastJson.success) {
          throw new Error(forecastJson.error || "Gagal memuat data ramalan");
        }

        const newsSuccess = newsJson.success ?? newsJson.succsess;
        if (!newsRes.ok || !newsSuccess) {
          throw new Error(newsJson.error || "Gagal memuat data berita");
        }

        if (active) {
          setWeather(weatherJson.data);
          setForecast(forecastJson.data);
          setNews(newsJson.data ?? []);
          setError(null);
        }
      } catch (err) {
        if (!active) return;
        const message =
          err instanceof Error
            ? err.message
            : "Terjadi kesalahan saat memuat dashboard";
        setError(message);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, [activeCity, activeCategory]);

  const hourlyForecast = useMemo(
    () => forecast?.list.slice(0, 16) ?? [],
    [forecast],
  );

  const activeWeatherIcon = weather
    ? getWeatherSymbol(weather.icon, weather.description)
    : null;
  const isNight = weather?.icon?.trim().toLowerCase().endsWith("n");
  const weatherBackgroundImage = getWeatherBackgroundImage(weather?.icon);
  const weatherContainerClass = weather
    ? getWeatherContainerClass()
    : "rounded-[2rem] border border-white/20 bg-white/80 p-6 shadow-sm";
  const mainSectionClass = getGlassSectionClass();
  const infoCardClass = getGlassCardClass();
  const headingTextClass = "text-[#1d1d1f]";
  const bodyTextClass = "text-[#1d1d1f]/80";
  const weatherTextClass = "text-white";
  const cardLabelTextClass = "text-white/80";
  const cardValueTextClass = "text-white";

  return (
    <main className="min-h-screen bg-white text-[#1d1d1f] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <p className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900 px-4 py-2 text-xs uppercase tracking-[0.32em] text-white shadow-sm">
              <Sparkles size={14} className="text-white/80" />
              Weather And News Dashboard
            </p>
            <div className="space-y-2">
              <h1
                className={`text-4xl font-semibold tracking-tight sm:text-5xl ${headingTextClass}`}
              >
                Weather & News
              </h1>
              <p className={`max-w-2xl text-base leading-7 ${bodyTextClass}`}>
                Report cuaca dan berita terkini dari berbagai negara
              </p>
            </div>
          </div>

          <div className="grid gap-3 text-right">
            <div className="rounded-3xl border border-white/10 bg-black backdrop-blur-md px-4 py-3 text-sm text-white shadow-sm transition-all duration-300">
              Lokasi tersinkron:{" "}
              <strong className="text-white font-semibold">{activeCity}</strong>
            </div>
            <div className="rounded-3xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-sm text-white shadow-sm">
              Kategori berita:{" "}
              <strong className="text-white">
                {categoryLabels[activeCategory]}
              </strong>
            </div>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[1.5fr,0.95fr]">
          <section
            className={weatherContainerClass}
            style={{ backgroundImage: `url('${weatherBackgroundImage}')` }}
          >
            <div className="relative">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-white/80">
                    <MapPin size={14} />
                    <span
                      className={`text-base font-normal ${weatherTextClass}`}
                    >
                      {activeCity}
                    </span>
                  </div>
                  <div className="flex items-center gap-5">
                    <div className="relative flex h-28 w-28 items-center justify-center rounded-3xl bg-black/20 backdrop-blur-xl">
                      {activeWeatherIcon ? (
                        <activeWeatherIcon.Icon className="text-white h-16 w-16" />
                      ) : (
                        <Sun className="h-16 w-16 text-white" />
                      )}
                    </div>
                    <div>
                      <p
                        className={`text-8xl font-extralight tracking-tight leading-none ${cardValueTextClass}`}
                      >
                        {weather?.temperature ?? "--"}°
                      </p>
                      <p
                        className={`mt-1 text-sm font-medium uppercase tracking-[0.24em] ${cardLabelTextClass}`}
                      >
                        {weather?.description ?? "Memuat cuaca..."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 shadow-gray-50">
                  <div className={`${infoCardClass} h-full p-4`}>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-white/40">
                      Feels like
                    </p>
                    <p className="mt-3 text-2xl font-semibold text-white">
                      {weather?.feelsLike ?? "--"}°
                    </p>
                  </div>
                  <div className={`${infoCardClass} h-full p-4`}>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-white/40">
                      Wind / Humidity
                    </p>
                    <div className="mt-3 flex flex-col gap-3 text-white">
                      <span className="inline-flex items-center gap-2 text-sm text-white">
                        <Wind className="h-4 w-4" />
                        <span className="font-medium leading-none text-white">
                          {weather?.windSpeed ?? "--"} m/s
                        </span>
                      </span>
                      <span className="inline-flex items-center gap-2 text-sm text-white">
                        <Droplet className="h-4 w-4" />
                        <span className="font-medium leading-none text-white">
                          {weather?.humidity ?? "--"}%
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-white font-bold">
                      Hourly forecast
                    </p>
                    <p
                      className="mt-1 text-sm text-white font-bold
                    "
                    >
                      Geser untuk melihat prediksi 24 jam berikutnya.
                    </p>
                  </div>
                </div>

                <div className="-mx-2 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-white/20 snap-x">
                  <div className="flex min-w-max gap-4 px-2 snap-x">
                    {loading ? (
                      <div className="flex min-w-[280px] items-center justify-center rounded-3xl border border-white/[0.08] bg-white/[0.06] backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] px-6 py-8 text-white/80">
                        Memuat...
                      </div>
                    ) : hourlyForecast.length ? (
                      hourlyForecast.map((item) => {
                        const forecastIcon = getWeatherSymbol(
                          item.icon,
                          item.description,
                        );
                        return (
                          <div
                            key={item.datetime}
                            className={`${infoCardClass} min-w-[120px] snap-start p-4 text-center`}
                          >
                            <p
                              className={`text-sm font-medium ${weatherTextClass}`}
                            >
                              {formatHour(item.datetime)}
                            </p>
                            <forecastIcon.Icon className="text-white mx-auto my-3 h-12 w-12" />
                            <p
                              className={`text-base font-semibold ${weatherTextClass}`}
                            >
                              {item.temperature}°
                            </p>
                            <p className="mt-1 text-xs text-white">
                              {item.description}
                            </p>
                          </div>
                        );
                      })
                    ) : (
                      <div className="min-w-[280px] rounded-3xl border border-white/[0.08] bg-white/[0.06] backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] p-6 text-center text-sm text-white/80">
                        Ramalan belum tersedia.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className={mainSectionClass}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                  News Stream
                </p>
                <h2
                  className={`mb-4 text-2xl font-semibold ${headingTextClass}`}
                >
                  Stories for {categoryLabels[activeCategory]}
                </h2>
              </div>
              <div className="rounded-full border border-white/15  px-4 py-2 text-sm font-semibold  dark:border-white/10 dark:bg-black dark:text-slate-200">
                {news.length} items
              </div>
            </div>

            {error ? (
              <div className="rounded-3xl border border-rose-200/70 bg-rose-50/80 p-5 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-900/20 dark:text-rose-200">
                {error}
              </div>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-3">
              {loading ? (
                <div className="col-span-full rounded-3xl border border-dashed border-white/15 bg-white/10 p-8 text-center text-slate-500 dark:border-white/10 dark:bg-black/20 dark:text-slate-400">
                  Sedang memuat berita...
                </div>
              ) : news.length ? (
                news.map((article, index) => (
                  <article
                    key={`${article.url}-${index}`}
                    className="overflow-hidden rounded-3xl border border-neutral-200/60 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                      <Image
                        src={article.imageUrl}
                        alt={article.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="space-y-3 p-5">
                      <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.24em] text-slate-500">
                        <span>{article.source}</span>
                        <span
                          className={
                            summaryColors[activeCategory] || "text-slate-500"
                          }
                        >
                          {categoryLabels[activeCategory]}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold leading-6 text-neutral-800">
                        {article.title}
                      </h3>
                      <p className="text-sm leading-6 text-slate-600">
                        {article.description}
                      </p>
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 transition hover:text-slate-700"
                      >
                        Read story
                        <ArrowRight size={16} />
                      </a>
                    </div>
                  </article>
                ))
              ) : (
                <div className="col-span-full rounded-3xl border border-dashed border-white/15 bg-white/10 p-8 text-center text-slate-500 dark:border-white/10 dark:bg-black/20 dark:text-slate-400">
                  Tidak ada berita yang tersedia untuk kategori ini.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-4 z-50 px-4 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 rounded-[2rem] border border-white/15 bg-white/10 p-4 shadow-[0_40px_80px_rgba(15,23,42,0.08)] backdrop-blur-2xl dark:border-white/10 dark:bg-black/20">
          <div className="flex flex-wrap items-center gap-3">
            {cityOptions.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => setActiveCity(city)}
                className={`rounded-3xl border px-4 py-2 text-sm font-semibold transition ${
                  city === activeCity
                    ? "border-black bg-slate-950 text-white dark:border-white dark:bg-white dark:text-slate-950"
                    : "border-transparent bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
                }`}
              >
                {city}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {categoryOptions.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  category === activeCategory
                    ? "border-black bg-slate-950 text-white dark:border-white dark:bg-white dark:text-slate-950"
                    : "border-transparent bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
                }`}
              >
                {categoryLabels[category]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
