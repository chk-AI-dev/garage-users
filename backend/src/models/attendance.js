//# create file for attendance model with the following fields : #Date	Name	Role	Location	Timestamp

const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: [true, 'Date is required']    
    },
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    role: {
        type: String,
        required: [true, 'Role is required']
    },
    location: {
        type: String,
        required: [true, 'Location is required']
    },
    timestamp: {
        type: Date,
        required: [true, 'Timestamp is required']
    }
}); 

module.exports = mongoose.model('Attendance', attendanceSchema);