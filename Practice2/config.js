require('dotenv').config();

exports.PORT = process.env.PORT;

exports.MONGODB_URL = process.env.MONGODB_URL;

exports.ORIGIN = process.env.ORIGIN;

exports.JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

exports.INFOBIP_HOSTNAME = process.env.INFOBIP_HOSTNAME;

exports.INFOBIP_API_KEY = process.env.INFOBIP_API;

exports.INFOBIP_USERNAME = process.env.INFOBIP_USERNAME;

exports.INFOBIP_PASSWORD =  process.env.INFOBIP_PASSWORD;