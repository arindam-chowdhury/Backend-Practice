const { Schema, model } = require("mongoose");

const otpSchema = new Schema(
    {
        phone: {
            type: String,
            required: true,
            trim: true
        },
        otp: {
            type: String,
            required: true,
            trim: true
        },
        createAt: {
            type: Date,
            default: Date.now(),
            expires: 60 * 5
        }
    }
);

module.exports = model("Otp", otpSchema);