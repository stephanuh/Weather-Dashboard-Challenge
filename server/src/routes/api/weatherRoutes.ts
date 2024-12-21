import { Router } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
 // TODO: GET weather data from city name
 // TODO: save city to search history

  console.log(`{req.method} request received to retrieve weather data`);
  
  const cityName = req.body.city;
  
  if(cityName) {
    try {
      const weatherData = await WeatherService.getWeatherForCity(cityName)
      console.log(`${req.method} update history: ${weatherData[0].city}`)
      await HistoryService.addCity(weatherData[0].city);
      res.status(200).json(weatherData);
    }catch(error){
      res.status(500).send('Unable to retrieve weather data');
    }
  }//else{
    //res.status(400).send('City name is required');
  //}
});

// TODO: GET search history
router.get('/history', async (req, res) => {
  console.log(`${req.method} request received to retrieve search history`);
  try{
    const history = await HistoryService.getCities();
    res.status(200).json(history);
  } catch(error){
    res.status(500).send('Unable to retrieve search history');
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
  const cityId = req.params.id;

  console.log(`${req.method} request received to delete ${cityId} from search history`);

  if(cityId){
    await HistoryService.removeCity(cityId);
    res.status(200).send('City removed successfully!');
  }else{
    res.status(400).send('City ID is required');
  }
});

export default router;
