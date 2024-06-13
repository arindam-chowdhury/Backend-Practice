const { model, Schema } = require("mongoose");

const userSchema = new Schema(
    {
        phone: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        name: {
            type: String,
            trim: true,
            required: true
        },
        password: {
            type: String,
            trim: true,
            required: true
        },
        email: {
            type: String,
            trim: true,
            required: true
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