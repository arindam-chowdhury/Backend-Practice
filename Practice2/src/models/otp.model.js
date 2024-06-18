const { Schema, model } = require("mongoose");

const otpSchema = new Schema(
    {
        phone: {
            type: String,
            trim: true
        },
        verifyPhone: {
            type: Boolean,
            default: false
        },
        email: {
            type: String,
            trim: true
            },
        verifyEmail: {
            type: Boolean,
            default: false
        },
        createAt: {
            type: Date,
            default: Date.now(),
            expires: 60 * 5
        }
    }
);

module.exports = model("Otp", otpSchema);