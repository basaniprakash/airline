'use strict';
const { DECIMAL } = require('sequelize');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BoardingTicket extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.customer = this.belongsTo(models['Customer']);
      this.FlightSchedule = this.belongsTo(models['FlightSchedule']);
    }
  }
  BoardingTicket.init({
    seat: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Please enter in a valid seating arrangement'
        }
      }
    },
    cost: {
      type: DataTypes.DECIMAL(7, 2)
    },
    isEmployee: {
      type: DataTypes.VIRTUAL,
      async get() {
        const customer = await this.getCustomer();
        if (!customer || !customer.email) {
          return false;
        }
        return customer.email.endsWith('avalonairlines');
      }
    }
  }, {
    sequelize,
    modelName: 'BoardingTicket',
  });

  // Employess should be able to fly for free
  BoardingTicket.beforeValidate('checkEmployee', (ticket, options) => {
    if (ticket.isEmployee) {
      ticket.subtotal = 0;
    }
  });

  // Subtotal should never be less than zero
  BoardingTicket.beforeSave('checkSubtotal', (ticket, options) => {
    if (ticket.subtotal < 0) {
      throw new Error('Invalid subtotal for this ticket');
    }
  });
  // Ensure that the seat the customer has requested is available
  BoardingTicket.beforeSave('checkSeat', async (ticket, options) => {
    // getDataValue will retrieve the new value (as opposed to the previous/current value)
    const newSeat = ticket.getDataValue('seat');
    const { transaction } = options;
    if (ticket.changed('seat')) {
      const boardingTicketExists = BoardingTicket.findOnd(
        { where: {
            seat: newSeat
        },
        transaction,
      });
      if (boardingTicketExists !== null) {
        throw new Error(`The seat ${newSeat} has already been taken.`);
      }
    }
  });
  BoardingTicket.afterSave('saveReceipt', async (ticket, options) => {
    await sequelize.models.Receipts.create({
      receipt: ticket.get()
    }, { transaction: options.transaction});
  });
  
  return BoardingTicket;
};