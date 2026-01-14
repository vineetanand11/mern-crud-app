const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minlength: [2, "Name must be at least 2 characters"]
    },
    email: {
        type: String, 
        required: [true, "Email is required"],
        unique:true,
        lowercase:true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters"],
        select: false
    },
    role: {
        type: String,
        enum: {
            values: ["admin", "user"],
            message: "Role must be admin or user"
        },
        default: "user"
    },
    age: {
        type: Number,
        required: [true, "Age is required"],
        min: [1, "Age must be greater than 0"],
        validate: {
            validator: Number.isInteger,
            message: "Age must be a number"
        }
    },
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "City",
        required: [true, "City is required"],
        validate: {
            validator: function(v) {
                // Check if value is not an empty string
                return v !== "" && v !== null;
            },
            message: "Please select a valid city"
        }
    }
}, { timestamps: true });

// userSchema.pre("save", async function () {
//   if (!this.isModified("password")) return;
//   this.password = await bcrypt.hash(this.password, 10);
// });

module.exports = mongoose.model("User", userSchema);
