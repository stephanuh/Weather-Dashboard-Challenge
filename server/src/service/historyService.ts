// TODO: Define a City class with name and id properties
import { promises as fs } from 'fs';
import path from 'path';

class City {
   name: string;
   id: string;

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
}
// TODO: Complete the HistoryService class
class HistoryService {
  private filePath: string;

  constructor() {
    this.filePath = path.join(__dirname, "db.json");
  }
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read(): Promise<City[]> {
  try{
    const data = await fs.readFile(this.filePath, 'utf8');
    return JSON.parse(data) as City[];
  }catch (error){
    return [];
  }
};
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]): Promise<void> {
    await fs.writeFile(this.filePath, JSON.stringify(cities, null, 2) );
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities():Promise<City[]> {
    return await this.read();
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(cityName: string): Promise<City> {
    const cities = await this.read();

    if (cities.some((city) => city.name.toLowerCase() === cityName.toLowerCase())){
      throw new Error('City already exists in the search history');
    }
    const newCity = new City(cityName, Date.now().toString()); //it worked???
    cities.push(newCity);

    await this.write(cities);
    return newCity;
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string): Promise<void> {
    const cities = await this.read();
    const updatedCities = cities.filter((city) => city.id !== id);

    if (cities.length === updatedCities.length){
      throw new Error('City not found');
    }
    await this.write(updatedCities);
  }
}

export default new HistoryService();
