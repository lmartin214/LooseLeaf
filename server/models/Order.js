const mongoose = require('mongoose');
//Schema for Order
const { Schema } = mongoose;

const orderSchema = new Schema({
  purchaseDate: {
    type: Date,
    default: Date.now
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
  ]
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;