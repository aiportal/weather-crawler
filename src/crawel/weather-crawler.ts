import dayjs, { Dayjs } from 'dayjs';
import _ from 'lodash';
import request from 'request-promise';
import fs from 'fs';
import path from 'path';
import iconv from 'iconv-lite';
import { CityData, CityValue } from './city-data';

export const MIN_DATE = dayjs('2011-01').toDate();

/**
 */
export class WeatherCrawler {

  public cites?: CityValue[];

  private readonly start: Dayjs;
  private readonly end: Dayjs;
  private readonly sleep: number;
  
  constructor(start?: Date, end?: Date, sleep?: number);
  constructor(sleep?: number);
  constructor(a?: any, b?: any, c?: any) {
    const [start, end, sleep] = _.isNumber(a) ? [undefined, undefined, a] : [a, b, c];

    this.start = dayjs(start || MIN_DATE);
    this.end = end ? dayjs(end) : dayjs().add(-1, 'M');
    this.sleep = sleep || 1000;
  }

  /**
   * crawl to file 
   * @param location directory path
   * @param progress
   */
  public async crawlToFile(location: string, progress?: (city: CityValue, month: Dayjs) => void): Promise<void> {
    
    for (let m = this.end;
      m.isAfter(this.start, 'M') || m.isSame(this.start, 'M'); 
      m = m.add(-1, 'M')
    ) {

      for (let city of this.cites || CityData.counties()) {
        const file = this.filePath(m, city, location);
        if (await fs.existsSync(file)) {
          continue;
        }

        const url = this.weatherUrl(m, city);
        await this.downloadToFile(url, file);

        if (progress) {
          progress(city, m);
        }

        await sleep(this.sleep);
      }
    }
  }

  private async downloadToFile(url: string, file: string): Promise<void> {

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

  private filePath(month: Dayjs, city: CityValue, location: string): string {
    const name = `${city.code}_${city.name}_${month.format('YYYYMM')}.json`;
    const path = `${location}/${city.province || '其他'}/${city.city || '其他'}/${name}`;
    return path;
  }
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
