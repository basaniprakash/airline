'use strict';
const {
  Model
} = require('sequelize');

const { DateTime } = require('luxon');

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
      this.Airplane = this.belongsTo(models['Airplane']);
      this.BoardingTickets = this.hasMany(models['BoardingTicket']);
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
        },
        validateDepartureTime() {
          const dt = DateTime.fromJSDate(this.departureTime);
          if (!dt.isValid) {
            throw new Error('Invalid departure time');
          }
          if (dt < DateTime.now()) {
            throw new Error("The departure time must be set within the future");
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