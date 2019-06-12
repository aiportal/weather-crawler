import dayjs, { Dayjs } from 'dayjs';
import _ from 'lodash';
import request from 'request-promise';
import fs from 'fs';
import path from 'path';
import { CityData, CityValue } from './city-data';

export const MIN_DATE = dayjs('2011-01').toDate();

/**
 */
export class WeatherCrawler {

  private readonly start: Dayjs;
  private readonly end: Dayjs;
  
  constructor(start: Date, end?: Date) {
    this.start = dayjs(start);
    this.end = end ? dayjs(end) : dayjs();
  }

  public async crawl(cities?: CityValue[], progress?: (city: CityValue) => void): Promise<void> {
    for (let city of cities || CityData.counties()) {
      for (let m = this.start; m.isBefore(dayjs(), 'M'); m = m.add(1, 'M')) {
        const url = this.weatherUrl(m, city);
        const path = this.filePath(m, city);
        await this.downloadFile(url, path);
        if (progress) {
          progress(city);
        }
      }
    }
  }

  private async downloadFile(url: string, file: string): Promise<void> {
    const data = await request.get(url);
    const dir = path.dirname(file);
    await fs.mkdirSync(dir, {recursive: true});
    await fs.writeFileSync(file, data);
  }

  private weatherUrl(month: Dayjs, city: CityValue): string {
    let path = `${month.format('YYYYMM')}/${city.code}_${month.format('YYYYMM')}.js`;

    if (this.start.isBefore('2016-03')) {
      path = `${city.code}_${month.format('YYYYM')}.js`;
    }

    return `http://tianqi.2345.com/t/wea_history/js/${path}`;
  }

  private filePath(month: Dayjs, city: CityValue): string {
    const name = `${city.code}_${city.name}_${month.format('YYYYMM')}.json`;
    const path = `./data/${city.province || '其他'}/${city.city || '其他'}/${name}`;
    return path;
  }
}