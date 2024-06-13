const https = require('follow-redirects').https;
const fs = require('fs');
const otpGenerator = require("otp-generator");
const { INFOBIP_HOSTNAME, INFOBIP_API_KEY } = require("../../config");

exports.generateOtp = (otp_length) => {
    return otpGenerator.generate(otp_length, { 
        upperCaseAlphabets: false, 
        lowerCaseAlphabets: false,
        specialChars: false 
    });
};

exports.sendMessage = async (phone, otp, next) => {
    try {
        const options = {
            'method': 'POST',
            'hostname': INFOBIP_HOSTNAME,
            'path': '/sms/2/text/advanced',
            'headers': {
                'Authorization': `App ${INFOBIP_API_KEY}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            'maxRedirects': 20
        };
        
        const req = https.request(options, (res) => {
            var chunks = [];
        
            res.on("data", (chunk) => {
                chunks.push(chunk);
            });
        
            res.on("end", (chunk) => {
                var body = Buffer.concat(chunks);
                console.log(body.toString());
            });
        
            res.on("error", (error) => {
                console.error(error);
            });
        });
        
        var postData = JSON.stringify({
            "messages": [
                {
                    "destinations": [{"to":"91"+phone}],
                    "from": "ServiceSMS",
                    "text": "Your opt is "+ otp +".\nOtp will valid upto 5 minutes."
                }
            ]
        });
        
        req.write(postData);
        
        req.end();
    } catch (err) {
        console.log(err);
        next(err);
    }
};  