var request = require('request');
var fs = require('fs');
var dayjs = require('dayjs');

function downloadFile(uri, filename, callback){
    var stream = fs.createWriteStream(filename);
    request(uri).pipe(stream).on('close', callback); 
}

async function donwloadCityWeather(code, start, end, name) {
  const dirName = `${name}_${code}`;
  try {
    await fs.mkdirSync(dirName);
  } catch (ex) {
    //...
  }

  try {
    for (let m = start; m.isBefore(end); m = m.add(1, 'month')) {
      const month = m.format('YYYYMM');
      const url = `http://tianqi.2345.com/t/wea_history/js/${month}/${code}_${month}.js`;
      const filename = `./${dirName}/${code}_${month}.js`;
      downloadFile(url, filename, () => {});
    }
  } catch (ex) {
    console.log('error: ', name);
  }
}

const cityMap = {
  '54774': '威海',
  '70609': '威海_成山头',
  '71693': '威海_环翠',
  '70949': '威海_荣成',
  '60971': '威海_乳山',
  '70629': '威海_石岛',
  '60220': '威海_文登',

  '53463': '呼和浩特',
  '70385': '呼和浩特_和林格尔',
  '71596': '呼和浩特_回民',
  '60987': '呼和浩特_清水河',
  '71107': '呼和浩特_赛罕',
  '70412': '呼和浩特_土默特左旗',
  '60988': '呼和浩特_托克托',
  '70415': '呼和浩特_武川',
  '71595': '呼和浩特_新城',
  '71597': '呼和浩特_玉泉',

  '56778': '昆明',
  '60848': '昆明_安宁',
  '70852': '昆明_呈贡',
  '70856': '昆明_东川',
  '70859': '昆明_富民',
  '72054': '昆明_官渡',
  '70872': '昆明_晋宁',
  '61016': '昆明_禄劝',
  '72053': '昆明_盘龙',
  '70960': '昆明_石林',
  '61004': '昆明_嵩明',
  '71063': '昆明_太华山',
  '72052': '昆明_五华',
  '70897': '昆明_寻甸',
  '72055': '昆明_西山',
  '61003': '昆明_宜良',

  '54527': '天津',
  '60516': '天津_宝坻',
  '71074': '天津_北辰',
  '71077': '天津_滨海新区',
  '60140': '天津_东丽',
  '1453': '天津_和平',
  '1454': '天津_河东',
  '1455': '天津_河西',
  '1457': '天津_河北',
  '1458': '天津_红桥',
  '0712': '天津_静海',
  '1076': '天津_津南',
  '0139': '天津_蓟州',
  '0517': '天津_宁河',
  '1456': '天津_南开',
  '0138': '天津_武清',
  '1073': '天津_西青',
};

const start = dayjs().add(-3, 'year').startOf('year').add(2, 'month');
const end = dayjs();

for (let [city, name] of Object.entries(cityMap)) {
  donwloadCityWeather(city, start, end, name);
}
