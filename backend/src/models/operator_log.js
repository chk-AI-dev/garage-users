//# create file named operator_log.js in the models directory and add the following code:
// model fields : operator_log : Date	Machine ID	Operator Name	Shift	Hours	Efficiency	Status
const equipments = require('./equipments');

const mongoose = require('mongoose');
const operatorLogSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: [true, 'Date is required']    
    },
    machineId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Machine ID is required'],
        ref: 'Equipment'
    },
    operatorName: {
        type: String,
        required: [true, 'Operator Name is required']
    },
    shift: {
        type: String,
        required: [true, 'Shift is required']
    },
    hours: {
        type: Number,
        required: [true, 'Hours is required']
    },
    efficiency: {
        type: Number,
        required: [true, 'Efficiency is required']
    },
    status: {
        type: String,
        enum: ['low', 'average', 'good'],
        default: 'average'
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

module.exports = mongoose.model('OperatorLog', operatorLogSchema);