import dayjs, { Dayjs } from 'dayjs';
import _ from 'lodash';
import request from 'request-promise';
import requestOrigin from 'request';
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import iconv from 'iconv-lite';
import { CityData, CityValue } from './city-data';

export const MIN_DATE = dayjs('2011-01').toDate();

/**
 */
export class WeatherCrawler {

  private readonly start: Dayjs;
  private readonly end: Dayjs;
  
  constructor(start?: Date, end?: Date) {
    this.start = dayjs(start || MIN_DATE);
    this.end = end ? dayjs(end) : dayjs();
  }

  public async crawl(progress?: (city: CityValue, month: Dayjs) => void): Promise<void>;
  public async crawl(cities?: CityValue[], progress?: (city: CityValue, month: Dayjs) => void): Promise<void>;
  public async crawl(x?: any, y?: any): Promise<void> {
    const [cities, progress] = _.isFunction(x) ? [undefined, x] : [x, y];

    for (let m = this.end.add(-1, 'M');
      m.isAfter(this.start, 'M') || m.isSame(this.start, 'M'); 
      m = m.add(-1, 'M')
    ) {
      for (let city of cities || CityData.counties()) {
        const url = this.weatherUrl(m, city);
        const path = this.filePath(m, city);
        if (!await fs.existsSync(path)) {
          await this.downloadFile(url, path);
          if (progress) {
            progress(city, m);
          }
          await sleep(1000)
        }
      }
    }
  }

  private async downloadFile(url: string, file: string): Promise<void> {

    const data = await request.get(url, {encoding: null});
    const js = iconv.decode(data, 'gb2312');

    const dir = path.dirname(file);
    await fs.mkdirSync(dir, {recursive: true});
    await fs.writeFileSync(file, js);
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

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
