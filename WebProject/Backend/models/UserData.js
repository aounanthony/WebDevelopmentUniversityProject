const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const UserDataSchema = new Schema({
    username : {
      type : String,
      required : true,
      unique : true
    },
    firstname : {
      type : String,
      required : true 
    },
    lastname : {
    type : String,
    required : true 
    },
    dateofbirth : {
    type : String,
    required : true 
    },
    email : {
    type : String,
    required : true 
    },
    driver: {
        type: Boolean,
        required: true
    },
    deliverySuggestions: [{
        type: String
    }]
  });

  const UserDataModel = mongoose.model('UserData',UserDataSchema);

  module.exports = UserDataModel;