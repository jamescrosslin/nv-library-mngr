/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];

const basename = path.basename(__filename);

const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs.readdirSync(__dirname)
  // filters only named js files in the models that do not have the name of this file
  .filter((file) => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
  // each model file has its export extracted and placed on the db object by model name
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// no associations right now but valuable for later so will leave for reference
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
