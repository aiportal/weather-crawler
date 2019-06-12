import request from 'request-promise';
import { CityData } from './crawel/city-data';
import { WeatherCrawler } from './crawel/weather-crawler'; 

/**
 * crawler 入口
 */
async function main() {
  // console.log(CityData.provinces().length);
  // for (let county of CityData.counties()) {
  //   console.log(county);
  // }
  const crawler = new WeatherCrawler(new Date('2019-05'));
  crawler.crawl();
}

main();
