// create driver log model with the following fields : #Date	Tipper ID	Driver Name	Trips	Fuel Used	Trips per Liter	Status
const mongoose = require('mongoose');
const equipments = require('./equipments');
// Define the driver log schema
const driverLogSchema = new mongoose.Schema({   
    date: {
        type: Date,
        required: [true, 'Date is required']
    },  
    tipperId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Tipper ID is required'],
        ref: 'Equipment'
    },
    driverName: {
        type: String,   
        required: [true, 'Driver Name is required']
    },
    trips: {    
        type: Number,
        required: [true, 'Trips is required']
    },      
    fuelUsed: {
        type: Number,
        required: [true, 'Fuel Used is required']
    },
    tripsPerLiter: {
        type: Number,
        required: [true, 'Trips per Liter is required']
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


module.exports = mongoose.model('DriverLog', driverLogSchema);
        