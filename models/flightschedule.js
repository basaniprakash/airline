'use strict';
const {
  Model
} = require('sequelize');

const availableAirports = [
  'MIA', 'JFK', 'LAX'
];

module.exports = (sequelize, DataTypes) => {
  class FlightSchedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  FlightSchedule.init({
    originAirport: {
      type: DataTypes.STRING,
      validate: {
        isIn: {
          args: [availableAirports],
          msg: 'Invalid origin airport'
        }
      }
    },
    destinationAirport: {
      type: DataTypes.STRING,
      validate: {
        isIn: {
          args: [availableAirports],
          msg: 'Invalid destination airport'
        },
        validDestination() {
          const hasAirportValues = this.originAirport !== null && this.destinationAirport != null;
          const invalidDestination = this.originAirport === this.destinationAirport;
          if (hasAirportValues && invalidDestination) {
            throw new Error("The destination airport cannot be the same as the origin");
          }
        }
      }
    },
    departureTime: {
      type: DataTypes.DATE,
      validate: {
        isIn: {
          args: [availableAirports],
          msg: 'Invalid destination airport'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'FlightSchedule',
  });
  return FlightSchedule;
};