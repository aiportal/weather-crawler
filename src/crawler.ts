import { CityData } from './crawel/city-data';
import { WeatherCrawler } from './crawel/weather-crawler'; 
import { Sequelize, DataTypes } from 'sequelize';


/**
 * crawler 
 */
async function main() {
  const crawler = new WeatherCrawler(new Date('2019-04'), new Date('2019-05'), 1000);
  // crawler.crawlToFile('./data', (c, m) => console.log(c, m.format('YYYY-MM')));
  const province = CityData.provinces()[0];
  const city = CityData.getCities(province.code)[0];
  const counties = CityData.getCounties(province.code, city.code);
  crawler.cites = counties;
  crawler.crawlToFile('./data', (c, m) => console.log(c, m.format('YYYY-MM')));
}

main();

async function testSqlite() {
  const db = new Sequelize('sqlite:./weather.db');
  const metaCode = db.define('weather_meta_code', {
    code: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    desc: DataTypes.STRING,
    province: DataTypes.STRING,
    city: DataTypes.STRING,
    county: DataTypes.STRING,
  });
  await metaCode.sync();
}

function statCityData() {
  let count = 0;
  let minCode, maxCode = 0;
  for (let county of CityData.counties()) {
    const code = Number(county.code);
    minCode = minCode ? Math.min(code, minCode) : code;
    maxCode = maxCode ? Math.max(code, maxCode) : code;
    console.log(county, ++count);
  }
  console.log(minCode, maxCode);
}
