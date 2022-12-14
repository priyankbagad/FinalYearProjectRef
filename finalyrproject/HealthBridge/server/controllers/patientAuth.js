const Patient = require("../models/Patient");
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

    const {name,email,phone,age,bloodGroup,address,password} = req.body;

    //Checking if the patient is already signed up or not
    Patient.findOne({
        email
    }).then((patient) => {
        if(patient) {
            res.status(400).json({
                errors : [{msg : "Email already exists"}]
            })
        }
    })

    const newPatient = new Patient({
        name,
        email,
        phone,
        age,
        bloodGroup,
        address,
        password 
    })

    newPatient.save()
    .then((savedPatient) => {
        res.status(200).json(savedPatient);
    }).catch(() => {
        res.status(400).json({
            errors : [{msg : "Error while registering the patient"}]
        })
    })
 }

module.exports.signin = (req,res) => {
    const {email,password} = req.body;
    
    Patient.findOne({
        email
    }).then((patient) => {
        if(!patient) {
            return res.status(422).json({
                errors : [{msg : "Invalid credentials"}]
            })
        }


        //If password matches then issue a token depending upon the payload given
        if(password === patient.password) {
            const token = jwt.sign({
                _id : patient._id
            },secret)
            
            const {_id,email,name,age,bloodGroup,type} = patient;

            res.json({
                token,
                patient : {_id,email,name,age,bloodGroup,type}
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
    Patient.findById(req.patient._id)
    .then((patient) => {
        res.status(200).json(patient);
    }).catch((err) => {
        res.status(422).json(err);
    })
}

module.exports.editProfile = (req,res) => {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(422).json({ errors: errors.array() });
    // }

    Patient.findById(req.patient._id)
    .then((patient) => {
  
    //Only updating fields if given by the user else keeping the previous ones
        if(req.body.name) {
        patient.name = req.body.name;
        }
        if(req.body.email) {
        patient.email = req.body.email;
        }
        if(req.body.phone) {
            patient.phone = req.body.phone;
        }
        if(req.body.age) {
            patient.age = req.body.age;
        }
        if(req.body.bloodGroup) {
            patient.bloodGroup = req.body.bloodGroup;
        }
        if(req.body.address) {
            patient.bloodGroup = req.body.bloodGroup;
        } 
        if(req.body.password) {
            patient.password = req.body.password;
        }

        patient.save()
        .then((patient) => {
            res.status(200).json(patient)
        }).catch((err) => {
            res.json(err);
        })
    })
    .catch((err) => {
      res.json(err);
    })
}