const Sequelize = require('sequelize');
const sequelize = new Sequelize("postgres://postgres:KristynaBV!80!@localhost:5432/workout-log");

module.exports = sequelize;