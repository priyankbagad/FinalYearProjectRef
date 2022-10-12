const mongoose = require("mongoose");
const schema = mongoose.Schema;

const {ObjectId} = mongoose.Schema.Types;

const appointmentsSchema = new schema({ 
    patient : {
        type : ObjectId,
        ref : "Patient"
    },
    doctor : {
        type : ObjectId,
        ref : "Doctor"
    },
    symptoms : {
        type : String
    },
    appointmentDate : {
        type : Date
    },
    department : {
        type : String
    },
    prescription : {
        symptoms : {
            type : String
        },
        medicine : {
            type : String
        },
        comments : {
            type : String
        },
        date : {
            type : Date
        }
    }
})

const appointment = mongoose.model("appointment",appointmentsSchema);

module.exports = appointment;