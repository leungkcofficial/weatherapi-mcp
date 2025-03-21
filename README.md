# WeatherAPI MCP Server

An MCP server that provides current weather and air quality data using WeatherAPI.

## Features

- Get current weather data for any city
- Air quality information (optional)
- Dynamic URI support for weather resources
- Easy integration with n8n, Claude Desktop App, Windsurf IDE,Cursor IDE, and other MCP clients

## Getting Started

### Get WeatherAPI Key

1. Go to [WeatherAPI.com](https://www.weatherapi.com)
2. Sign up for a free account
3. After signing in, go to your dashboard
4. Copy your API key from the "API Keys" section

### MCP Configuration

Add the following configuration to your Windsurf MCP config file:

```json
{
  "mcpServers": {
    "weather": {
      "command": "npx",
      "args": ["-y", "@swonixs/weatherapi-mcp"],
      "env": {
        "WEATHER_API_KEY": "YOUR_API_KEY_HERE"
      }
    }
  }
}
```

Replace `YOUR_API_KEY_HERE` with the API key you obtained from WeatherAPI.com.

### Tools

#### get_weather

Get current weather data for a specified city.

Parameters:
- `location` (string): City name

Example response:
```json
{
  "location": "London",
  "country": "United Kingdom",
  "temp_c": 15.0,
  "condition": "Partly cloudy",
  "humidity": 71,
  "wind_kph": 14.4,
  "air_quality": {
    "co": 230.3,
    "no2": 13.5,
    "o3": 52.9,
    "pm2_5": 8.5,
    "pm10": 12.1,
    "us-epa-index": 1
  }
}
```

### Repository

[WeatherAPI MCP Server](https://github.com/swonixs/weatherapi-mcp)

## License

MIT
