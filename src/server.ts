#!/usr/bin/env node

import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import axios from 'axios';
import dotenv from 'dotenv';

// .env dosyasını yükle
dotenv.config();

// Weather API yapılandırması
const API_KEY = process.env.WEATHER_API_KEY;
if (!API_KEY) {
  throw new Error('WEATHER_API_KEY çevre değişkeni tanımlanmamış!');
}
const BASE_URL = 'http://api.weatherapi.com/v1';

// MCP sunucusu oluştur
const server = new McpServer({
  name: "WeatherAPI",
  version: "1.0.0"
});

// Weather API tool tanımı
type WeatherArgs = {
  location: string;
  aqi?: boolean;
};

const getWeather = async (args: WeatherArgs) => {
  try {
    const response = await axios.get(`${BASE_URL}/current.json`, {
      params: {
        key: API_KEY,
        q: args.location,
        aqi: args.aqi ? 'yes' : 'no'
      }
    });

    const data = response.data;
    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify({
          location: data.location.name,
          country: data.location.country,
          temp_c: data.current.temp_c,
          condition: data.current.condition.text,
          humidity: data.current.humidity,
          wind_kph: data.current.wind_kph,
          air_quality: args.aqi ? data.current.air_quality : undefined
        }, null, 2)
      }]
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Hava durumu bilgisi alınamadı: ${error.response?.data?.error?.message || error.message}`);
    }
    throw error;
  }
};

// Tool'u kaydet
server.tool(
  "get_weather",
  {
    location: z.string().describe("Şehir adı"),
    aqi: z.boolean().optional().describe("Hava kalitesi bilgisi isteniyor mu?")
  },
  async (args: WeatherArgs) => getWeather(args)
);

// Weather resource tanımı
server.resource(
  "weather",
  new ResourceTemplate("weather://{city}/current", { list: undefined }),
  async (uri, variables) => {
    const city = variables.city as string;
    const result = await getWeather({ location: city, aqi: true });
    return {
      contents: [{
        uri: uri.href,
        text: result.content[0].text
      }]
    };
  }
);

// Sunucuyu başlat
const transport = new StdioServerTransport();
await server.connect(transport);
