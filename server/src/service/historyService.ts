// TODO: Define a City class with name and id properties

import fs from 'node:fs/promises';
import {v4 as uuidv4} from 'uuid';

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

  // TODO: Define a read method that reads from the searchHistory.json file
  private async read() {
    return await fs.readFile('db/searchHistory.json',{ 
      flag:'a+',
      encoding: 'utf8',
    });
  };

  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    return await fs.writeFile ('db/searchHistory.json', JSON.stringify(cities, null, '/t'));
  };

  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    return await this.read().then((cities) => {
      let parsedCities: City[];
      try{
        parsedCities = [].concat(JSON.parse(cities));
      } catch (error){
        parsedCities = [];
      }
      return parsedCities;
    });
  };

  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {
    if (!city) {
      throw new Error('City is required');
    }
    const newCity: City = {name: city, id: uuidv4()};
    return await this.getCities()
    .then((cities) => {
      if (cities.find((index) => index.name === city)){
        return cities;
      }
      return[...cities,newCity];
    })
    .then((updatedCity) => this.write(updatedCity))
    .then(() => newCity);
  };

  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string) {
    return await this.getCities()
    .then((cities) => cities.filter((city) => city.id != id))
    .then((filterCities) => this.write(filterCities));
  };
};

export default new HistoryService();
