import { DataTypes } from 'sequelize';
import sequelize from '../database/index.js';

const Dado = sequelize.define('Dado', {
  p1: {
    type: DataTypes.STRING,
    allowNull: false
  },
  p2: {
    type: DataTypes.STRING,
    allowNull: false
  },
  p3: {
    type: DataTypes.STRING,
    allowNull: false
  },
  stringId:{
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  }
}, {
  tableName: 'dados'
});

export default Dado;
