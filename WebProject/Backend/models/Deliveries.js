const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const DeliverySchema = new Schema({
    username: {
        type: String,
    },
    date: {
        type: String,
    },
    from: {
        type: String,
    },
    to: {
        type: String,
    },
    cost: {
        type: String
    },
    dimensions: {
        type: String,
    },
    weight: {
        type: String,
    },
    fragile: {
        type: String
    },
    liquid: {
        type: String,
    },
    flammable: {
        type: String,
    },
    status: {
        type: String,
    },
    progress: {
        type: String,
    },
    driver: {
        type: String,
    },

});

  const DeliveryModel = mongoose.model('Deliveries',DeliverySchema);

  module.exports = DeliveryModel;