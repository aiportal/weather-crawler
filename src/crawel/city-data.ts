import _ from 'lodash';

// const CITY_SELECT_DATA_URL = 'http://tianqi.2345.com/js/citySelectData.js';
import { prov as CITY_DATA, provqx as COUNTY_DATA } from './constants/citySelectData';
import { province as PROVINCE_DATA } from './constants/provinceData';


export interface CityValue {
  code: string;
  name: string;
  province?: string,
  city?: string,
}

/**
 * city data wrapper
 */
export class CityData {
  
  private static readonly _provinces = PROVINCE_DATA;
  private static readonly _cities = CITY_DATA;
  private static readonly _counties = COUNTY_DATA;

  static provinces(): CityValue[] {
    return _(this._provinces)
      .map((v, k) => ({code: k, name: v}))
      .value();
  }

  static *cities(): IterableIterator<CityValue> {
    for (let prov of this.provinces()) {
      const cities = this.getCities(prov.code);
      for (let city of cities) {
        city.province = prov.name,
        yield city;
      }
    }
  }

  static *counties(): IterableIterator<CityValue> {
    for (let prov of this.provinces()) {
      const cities = this.getCities(prov.code);
      for (let city of cities) {
        const counties = this.getCounties(prov.code, city.code);
        for (let county of counties) {
          county.province = prov.name;
          county.city = city.name;
          yield county;
        }
      }
    }
  }

  static getCities(province: string): CityValue[] {
    const prov = Number(province)
    return _(this._cities[prov])
      .split('|')
      .map(x => /(\d+)-\w (\S+)-(\d+)/.exec(x))
      .compact()
      .map(x => ({code: x[1], name: x[2]}))
      .value();
  }

  static getCounties(province: string, city: string): CityValue[] {
    const prov = Number(province)
    return _(this._counties[prov])
      .split('|')
      .map(x => /(\d+)-\w (\S+)-(\d+)/.exec(x))
      .compact()
      .filter(x => x[3] === city)
      .map(x => ({code: x[1], name: x[2]}))
      .value();
  }

  static initalize() {
  }
}

CityData.initalize();
