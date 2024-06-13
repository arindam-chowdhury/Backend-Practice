require('dotenv').config();

exports.PORT = process.env.PORT;

exports.MONGODB_URL = process.env.MONGODB_URL;

exports.ORIGIN = process.env.ORIGIN;

exports.JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

exports.INFOBIP_HOSTNAME = process.env.INFOBIP_HOSTNAME;

exports.INFOBIP_API_KEY = process.env.INFOBIP_API;

exports.INFOBIP_USERNAME = process.env.INFOBIP_USERNAME;

exports.INFOBIP_PASSWORD =  process.env.INFOBIP_PASSWORD;

exports.TWILIO_SID = process.env.TWILIO_SID;

exports.TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;

exports.TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

exports.OTPLESS_CLIENT_ID = process.env.OTPLESS_CLIENT_ID;

exports.OTPLESS_CLIENT_SECRET = process.env.OTPLESS_CLIENT_SECRET;