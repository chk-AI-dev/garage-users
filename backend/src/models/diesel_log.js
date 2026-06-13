//create a new file named diesel_log.js in the models directory and add the following code:
//model fields : diesel_log : Date Opening Received Issued Closing Alert 


const mongoose = require('mongoose');   
// Define the diesel log schema
const dieselLogSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  opening: {
    type: Number,
    required: [true, 'Opening is required']
  },
  received: {
    type: Number,
    required: [true, 'Received is required']
  },
  
  issued: {
    type: Number,
    required: [true, 'Issued is required']
  },
  closing: {
    type: Number,
    required: [true, 'Closing is required']
  },
  alert: {
    type: Boolean,
    default: false
  },
   createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});


module.exports = mongoose.model('DieselLog', dieselLogSchema);
