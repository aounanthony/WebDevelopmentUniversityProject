const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const PathSchema = new Schema({
    date: {
        type: String,
    },
    from: {
        type: String,
    },
    to: {
        type: String,
    },
    username: {
        type: String,
    }
  });

  const PathModel = mongoose.model('DriverPath',PathSchema);

  module.exports = PathModel;