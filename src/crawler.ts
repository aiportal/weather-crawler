import request from 'request-promise';
import { CityData } from './crawel/city-data';

/**
 * main 入口
 */
async function main() {
  console.log(CityData.provinces.length);
  console.log(CityData.cities('10'));
}

main();
