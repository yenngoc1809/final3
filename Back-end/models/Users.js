const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userType: {
        type: String,
        require: true
    },
    userFullName: {
        type: String,
        require: true,
        unique: true
    },
    admissionId: {
        type: String,
        min: 3,
        max: 15,
    },
    employeeId: {
        type: String,
        min: 3,
        max: 15,
    },
    age: {
        type: Number
    },
    gender: {
        type: String
    },
    dob: {
        type: String
    },
    address: {
        type: String,
        default: ""
    },
    mobileNumber: {
        type: Number,
        require: true
    },
    // photo: {
    //     type: String,
    //     default: ""
    // },
    email: {
        type: String,
        require: true,
        max: 50,
        unique: true
    },
    password: {
        type: String,
        require: true,
        min: 6
    },
    points: {
        type: Number,
        default: 0
    },
    activeTransactions: [{
        type: mongoose.Types.ObjectId,
        ref: "BookTransaction"
    }],
    prevTransactions: [{
        type: mongoose.Types.ObjectId,
        ref: "BookTransaction"
    }],
    isAdmin: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true
    });

module.exports = mongoose.model('Users', UserSchema);

// const mongoose = require('mongoose');

// const UserSchema = new mongoose.Schema({
//     userType: { type: String, required: true },
//     userFullName: { type: String, required: true },
//     admissionId: { type: String, required: false },
//     employeeId: { type: String, required: false },
//     age: { type: Number, required: true },
//     dob: { type: Date, required: true },
//     gender: { type: String, required: true },
//     address: { type: String, required: true },
//     mobileNumber: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     isAdmin: { type: Boolean, default: false }
// }, { timestamps: true });

// module.exports = mongoose.model('Users', UserSchema);
