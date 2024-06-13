// const https = require('follow-redirects').https;
// const infobip = require("infobip");
// const fs = require('fs');
const otpGenerator = require("otp-generator");

const { INFOBIP_HOSTNAME, INFOBIP_API_KEY, INFOBIP_USERNAME, INFOBIP_PASSWORD, TWILIO_SID, TWILIO_AUTH_TOKEN, OTPLESS_CLIENT_ID, OTPLESS_CLIENT_SECRET } = require("../../config");
const { sendOTP } = require('otpless-node-js-auth-sdk');

const client = require("twilio")(TWILIO_SID, TWILIO_AUTH_TOKEN);
exports.generateOtp = (otp_length) => {
    return otpGenerator.generate(otp_length, { 
        upperCaseAlphabets: false, 
        lowerCaseAlphabets: false,
        specialChars: false 
    });
};

// phoneNumber: `91${phone}`,
// email: email,
// channel: "SMS",
// expiry: 300,
// otpLength: 4,
// clientId: OTPLESS_CLIENT_ID,
// clientSecret: OTPLESS_CLIENT_SECRET

exports.sendMessage = async (message, next) => {
    try {
        const res = await sendOTP(message.phoneNumber, message.channel, message.expiry, message.otpLength, OTPLESS_CLIENT_ID, OTPLESS_CLIENT_SECRET);
        // next(res);
        console.log(res);

        // client.messages.create(message)
        // .then((e) => {
        //     console.log(e.sid);
        //     next();
        // });
        


        // const client = new infobip.Infobip(INFOBIP_USERNAME, INFOBIP_PASSWORD);
        // client.SMS.send(message); +91 89108 45557


        // const options = {
        //     'method': 'POST',
        //     'hostname': INFOBIP_HOSTNAME,
        //     'path': '/sms/2/text/advanced',
        //     'headers': {
        //         'Authorization': `App ${INFOBIP_API_KEY}`,
        //         'Content-Type': 'application/json',
        //         'Accept': 'application/json'
        //     },
        //     'maxRedirects': 20
        // };
        
        // const req = https.request(options, (res) => {
        //     var chunks = [];
        
        //     res.on("data", (chunk) => {
        //         chunks.push(chunk);
        //     });
        
        //     res.on("end", (chunk) => {
        //         var body = Buffer.concat(chunks);
        //         console.log(body.toString());
        //     });
        
        //     res.on("error", (error) => {
        //         console.error(error);
        //     });
        // });
        
        // var postData = JSON.stringify({
        //     "messages": [
        //         {
        //             "destinations": [{"to":"91"+phone}],
        //             "from": "ServiceSMS",
        //             "text": "Your opt is "+ otp +".\nOtp will valid upto 5 minutes."
        //         }
        //     ]
        // });
        
        // req.write(postData);
        
        // req.end();
    } catch (err) {
        console.log(err);
        next(err);
    }
};  