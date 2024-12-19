import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
};
// TODO: Define a class for the Weather object
class Weather {
  city: string;
  date: string;
  icon: string;
  description: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  
  constructor(
    city: string,
    date: string,
    icon: string,
    description: string,
    temperature: number,
    humidity: number,
    windSpeed: number,
    
  ) {
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.description = description;
    this.temperature = temperature;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
  }
};
// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private city: string = '';
  private baseURL: string;
   private apiKey: string;

   constructor() {
    this.baseURL = process.env.API_BASE_URL || '';
    this.apiKey = process.env.API_KEY || '';
   }

  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string): Promise<any> {
    this.city = query;
    const url = this.buildGeocodeQuery();

    try {
      const response = await fetch(url);
      if (!response.ok){
        throw new Error(`fetching location data for ${response.status} not found`);
      }
      const locationData = await response.json();

      if(locationData.length === 0){
        throw new Error(` Location data not found for ${this.city}`);
      } else{
        this.city = locationData[0].name;
      }
      return locationData;
    }catch (error){
      console.error(error);
      throw error;
    }
  }

  // TODO: Create destructureLocationData method
   private destructureLocationData(locationData: any): Coordinates {
    const {lat, lon} = locationData[0];
    if (!lat || !lon){
      throw new Error('Coordinates not found');
    }
    return {lat, lon};
 };

  // TODO: Create buildGeocodeQuery method
   private buildGeocodeQuery(): string { 
  
  const queryLimit = 1;
    let query = `${this.baseURL}/geo/1.0/direct?q=${encodeURIComponent(this.city)}$limit=${queryLimit}&appid=${this.apiKey}`;
    return query;
   }
  
   // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    let query = `${this.baseURL}/data/2.5/forecast?units=imperial&lat=${coordinates.lat}&appid=${this.apiKey}`;
   return query;
  }

  // TODO: Create fetchAndDestructureLocationData method
   private async fetchAndDestructureLocationData(query:string):Promise<Coordinates> {
    const locationData = await this.fetchLocationData(query);
    return this.destructureLocationData(locationData);
   }

  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const url = this.buildWeatherQuery(coordinates);
    const response = await fetch(url);

    if (!response.ok){
      throw new Error('Weather data not found');
    }
    const data = await response.json();
    return data;
  }

  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any):Weather {
    const { dt_txt, weather, main, wind} = response;
    const date = this.convertDate(dt_txt);
    const icon = weather[0].icon;
    const description = weather[0].description;
    const temperature = main.temp;
    const humidity = main.humidity;

    let  weatherReading = new Weather(
      this.city,
      date,
      icon,
      description,
      temperature,
      humidity,
      wind.speed
    );
    return weatherReading;
  }
  private convertDate(fullDate: string){
    const data = new Date(fullDate);
    const formatter = new Intl.DateTimeFormat('en-US',{day:'2-digit', month:'2-digit', year:'numeric'});
    return formatter.format(data);
  }

  // TODO: Complete buildForecastArray method
   private buildForecastArray(weatherData: any[]): Weather[] {
    const forecast:{[key: string]: Weather} = {};

    weatherData.forEach((data: any) => {
      const uniqueDate = data.dt_txt.split('')[0];
      if(! forecast[uniqueDate]){
        forecast[uniqueDate] = this.parseCurrentWeather(data);
      }
    });
    return Object.values(forecast);
  }

  // TODO: Complete getWeatherForCity method
   async getWeatherForCity(city: string): Promise<Weather[]> {
    console.log(`Getting weather data for ${city}`);
    this.city = city;
    const coordinates = await this.fetchAndDestructureLocationData(city);
    const weatherData = await this.fetchWeatherData(coordinates);
    const weatherArray = this.buildForecastArray(weatherData.list);
    return weatherArray;
   }
}

export default new WeatherService();
