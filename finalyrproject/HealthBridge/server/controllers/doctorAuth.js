const Doctor = require("../models/Doctor");
const {validationResult} = require("express-validator");
const jwt = require("jsonwebtoken");

const secret = "my_secret_key";

module.exports.signup = (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({
            errors : errors.array()
        })
    }

    const {name,email,department,password} = req.body;

    //Checking if the patient is already signed up or not
    Doctor.findOne({
        email
    }).then((doctor) => {
        if(doctor) {
            res.status(400).json({
                errors : [{msg : "Email already exists"}]
            })
        }
    })

    const newDoctor = new Doctor({
        name,
        email,
        department,
        password 
    })

    newDoctor.save()
    .then((savedDoctor) => {
        res.status(200).json({
            savedDoctor
        });
    }).catch((err) => {
        res.status(400).json({
            errors : [{msg : "Error while registering the patient"}]
        })
    })

}

module.exports.signin = (req,res) => {
    const {email,password} = req.body;
    
    Doctor.findOne({
        email
    }).then((doctor) => {
        if(!doctor) {
            return res.status(422).json({
                errors : [{msg : "Invalid credentials"}]
            })
        }


        //If password matches then issue a token depending upon the payload given
        if(password === doctor.password) {
            const token = jwt.sign({
                _id : doctor._id
            },secret)
            
            const {_id,email,department,name,type} = doctor;

            res.json({
                token,
                doctor : {_id,email,department,name,type}
            })
        }

        else {
            res.json({
                errors : [{msg : "Invalid Credentials"}]
            })
        }
    })
}

module.exports.dashboard = (req,res) => {
    console.log(req.doctor,"doctor id");
    Doctor.findById(req.doctor._id)
    .then((doctor) => {
        res.status(200).json(doctor);
    }).catch((err) => {
        res.status(422).json(err);
    })
}

module.exports.getAllDoctors = (req,res) => {
    Doctor.find({})
    .then((doctor) => {
        res.status(200).json(doctor);
    }).catch((err) => {
        res.status(422).json(err);
    })
}