const { model, Schema } = require("mongoose");

const userSchema = new Schema(
    {
        phone: {
            type: String,
            trim: true,
            unique: true,
            required: true
        },
        verifyPhone: {
            type: Boolean,
            default: false
        },
        name: {
            type: String,
            trim: true,
        },
        password: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            trim: true,
            unique: true
        },
        verifyEmail: {
            type: Boolean,
            default: false
        },
        role: {
            type: String,
            enum: ['admin', 'user', 'manager'],
            default: 'user'
        }
    },
    {
        timestamps: true
    }
);

module.exports = model("User", userSchema);