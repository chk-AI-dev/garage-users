//# create file named maintenance.js in the models directory and add the following code:
// model fields : operator_log : Machine ID	Last Service Hours	Current Hours	Next Due  Status
const equipments = require('./equipments');
// mongoose schema for maintenance
const mongoose = require('mongoose');
const maintenanceSchema = new mongoose.Schema({
    machineId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Machine ID is required'],
        ref: 'Equipment'
    },
    last_service:{ 
        type: Date,
        required: [true, 'Date is required']    
    },
    service_hours:{
        type:Number,
        required: [true, 'Enter service hours']
    },
    current_hours:{
        type:Number,
        required: [true, 'Enter current hours']
    },
    next_due:{
        type:Date,
        required: [true, 'Enter next due date']
    },
    status:{
        type: String,
        enum: ['Due', 'Ok'],
        default: 'Due'
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

// export module
module.exports = mongoose.model('Maintenance', maintenanceSchema);
            
