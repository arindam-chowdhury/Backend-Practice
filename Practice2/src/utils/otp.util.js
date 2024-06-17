const { OTPLESS_CLIENT_ID, OTPLESS_CLIENT_SECRET } = require("../../config");
const axios = require('axios');


//----------------------------------------------------------------
// sending otp messages to clients mobile devices
//----------------------------------------------------------------
exports.sendMessage = async (message, next) => {
    try {
        const response = await axios.post("https://auth.otpless.app/auth/otp/v1/send", {
            phoneNumber: message.phoneNumber,
            channel: message.channel,
            expiry: message.expiry,
            otpLength: message.otpLength,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'clientId': OTPLESS_CLIENT_ID,
                'clientSecret': OTPLESS_CLIENT_SECRET
            }
        });
        // console.log(response);
        return response.data;

    } catch (err) {
        console.log(err);
        next(err);
    }
}; 


//----------------------------------------------------------------
// verify otp message to client
//----------------------------------------------------------------
exports.verify = async (message, next) => {
    try {
        const response = await axios.post("https://auth.otpless.app/auth/otp/v1/verify", {
            phoneNumber: message.phoneNumber,
            otp: message.otp,
            orderId: message.orderId
        }, {
            headers: {
                'Content-Type': 'application/json',
                'clientId': OTPLESS_CLIENT_ID,
                'clientSecret': OTPLESS_CLIENT_SECRET
            }
        });
        // console.log(response);
        return response.data;

    } catch (err) {
        console.log(err);
        next(err);
    }
}