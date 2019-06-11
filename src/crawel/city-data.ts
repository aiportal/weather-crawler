import _ from 'lodash';

// const CITY_SELECT_DATA_URL = 'http://tianqi.2345.com/js/citySelectData.js';
import {prov as CITY_DATA, provqx as COUNTY_DATA} from './citySelectData';

const PROVINCE_DATA = {
  '10': '安徽',
  '11': '澳门',
  '12': '北京',
  '43': '重庆',
  '13': '福建',
  '14': '甘肃',
  '15': '广东',
  '16': '广西',
  '17': '贵州',
  '18': '海南',
  '19': '河北',
  '20': '河南',
  '21': '黑龙江',
  '22': '湖北',
  '23': '湖南',
  '24': '吉林',
  '25': '江苏',
  '26': '江西',
  '27': '辽宁',
  '28': '内蒙古',
  '29': '宁夏',
  '30': '青海',
  '31': '山东',
  '32': '山西',
  '33': '陕西',
  '34': '上海',
  '35': '四川',
  '36': '台湾',
  '37': '天津',
  '38': '西藏',
  '39': '香港',
  '40': '新疆',
  '41': '云南',
  '42': '浙江',
}

export interface DataValue {
  id: string;
  name: string;
}

/**
 * city data wrapper
 */
export class CityData {
  
  private static readonly _provinces = PROVINCE_DATA;
  private static readonly _cities = CITY_DATA;
  private static readonly _counties = COUNTY_DATA;

  static get provinces(): DataValue[] {
    return _(this._provinces)
      .map((k, v) => ({id: k, name: v}))
      .value();
  }

  static cities(province: string) {
    const prov = Number(province)
    return _(this._cities[prov])
      .split('|')
      .map(x => x.split('-'))
      .map(x => ({id: x[0], name: x[1]}))
      .value();
  }

  static counties(city: string) {

  }

  static initalize() {
    console.log(this._provinces[41]);
    console.log('init');
  }
}

CityData.initalize();
