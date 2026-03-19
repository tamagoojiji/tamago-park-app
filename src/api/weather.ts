// Open-Meteo API（無料・キー不要）
// USJの座標: 34.6654, 135.4323

export interface DailyWeather {
  date: string; // YYYY-MM-DD
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  precipitationProb: number;
}

const USJ_LAT = 34.6654;
const USJ_LON = 135.4323;

// WMOコード → 天気絵文字
export function weatherCodeToEmoji(code: number): string {
  if (code === 0) return '☀️';
  if (code <= 3) return '⛅';
  if (code <= 48) return '🌫️';
  if (code <= 57) return '🌦️';
  if (code <= 67) return '🌧️';
  if (code <= 77) return '🌨️';
  if (code <= 82) return '🌧️';
  if (code <= 86) return '🌨️';
  if (code <= 99) return '⛈️';
  return '❓';
}

// WMOコード → 天気テキスト
export function weatherCodeToText(code: number): string {
  if (code === 0) return '快晴';
  if (code <= 3) return 'くもり';
  if (code <= 48) return '霧';
  if (code <= 57) return '霧雨';
  if (code <= 67) return '雨';
  if (code <= 77) return '雪';
  if (code <= 82) return '雨';
  if (code <= 86) return '雪';
  if (code <= 99) return '雷雨';
  return '不明';
}

export async function fetchWeather(): Promise<DailyWeather[]> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${USJ_LAT}&longitude=${USJ_LON}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia%2FTokyo&forecast_days=16`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('天気データの取得に失敗しました');

  const data = await res.json();
  const daily = data.daily;

  return daily.time.map((date: string, i: number) => ({
    date,
    weatherCode: daily.weather_code[i],
    tempMax: Math.round(daily.temperature_2m_max[i]),
    tempMin: Math.round(daily.temperature_2m_min[i]),
    precipitationProb: daily.precipitation_probability_max[i],
  }));
}
