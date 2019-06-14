
import {Sequelize, DataTypes, ModelAttributes, ModelOptions, Model} from 'sequelize';

export class StoreMetaData {

  static async initalize(db: Sequelize) {
    const codes = db.define('weather_codes', TABLE_WEATHER_CODE, DB_OPTIONS);
    db.define('weather_metas', TABLE_WEATHER_META, DB_OPTIONS);
    db.define('weather_2019', TABLE_WEATHER_DATA, DB_OPTIONS);
    await db.sync();
  }
}

const TABLE_WEATHER_CODE: ModelAttributes = {
  'code': {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  'desc': DataTypes.STRING,
  'province': {
    type: DataTypes.STRING,
    allowNull: false,
  },
  'city': {
    type: DataTypes.STRING,
    allowNull: false,
  },
  'county': {
    type: DataTypes.STRING,
    allowNull: false,
  }
}

const TABLE_WEATHER_META: ModelAttributes = {
  'weather': {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  'num': {
    type: DataTypes.SMALLINT,
    allowNull: false,
  },
  'name': {
    type: DataTypes.STRING,
    allowNull: false,
  }
}

const TABLE_WEATHER_DATA: ModelAttributes = {
  'code': {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  'day': {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  'weather': {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}

const DB_OPTIONS: ModelOptions = {
  timestamps: false,
  freezeTableName: true,
}
