const mongoose = require("mongoose");

const countrySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Country name is required"],
        unique: true,
        trim: true
    },
    code: {
        type: String,
        required: [true,  "Country code is required"],
        uppercase: true,
        minlength: 2,
        maxlength: 3
    }
}, {timestamps: true});

module.exports = mongoose.model("Country", countrySchema);
