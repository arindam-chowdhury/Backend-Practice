const { TWILIO_PHONE_NUMBER, OTPLESS_CLIENT_ID, OTPLESS_CLIENT_SECRET } = require("../../config");
const { PHONE_ALREADY_EXIST } = require("../../errors");
const otpModel = require("../models/otp.model");
const { generateOtp, sendMessage } = require("../utils/otp.util");

// send opt to phone number
exports.sendOtpPhoneNumber = async (req, res, next) => {
    try {
        let { phone } = req.body;

        //check if phone already exist
        const phoneExist = await otpModel.findOne({ phone });
        if(phoneExist) {
            next({ status: 400, message: PHONE_ALREADY_EXIST });
            return;
        }

        //create new otp
        // const otp = generateOtp(4);
        const createOtp = new otpModel({
            phone,
            // otp
        });

        // send otp message through infobip service
        // const message = {
        //     from: "hatchtag",
        //     to: "91"+phone,
        //     text: `Your OTP is ${otp}. This otp is valid upto next 5 minutes.`
        // };

        // send otp message through twilio service
        // const message = {
        //     from: TWILIO_PHONE_NUMBER,
        //     to: phone,
        //     body: `Your OTP is ${otp}. This otp is valid upto next 5 minutes.`
        // };

        // send otp message through OTPless service
        const content = {
            phoneNumber: `91${phone}`,
            // email: email,
            channel: "SMS",
            expiry: 300,
            otpLength: 4
        }
        // await sendMessage(message, next);
        const sendMessageRes = await sendMessage(content, next);

        //save otp
        await createOtp.save();

        //send response
        res.status(200).json({
            type:'success',
            message: 'OTP sent successfully',
            data: {
                phone: createOtp.phone,
                optless_data: sendMessageRes
            }
        });
    }catch(err) {
        next(err);
    }
};

// verify otp
exports.verifyOtp = async (req, res, next) => {
    try {
        let { phone, otp } = req.body;

        //check if otp exist
        const otpExist = await otpModel.findOne({ phone, otp });
        if(!otpExist) {
            next({ status: 400, message: 'Invalid OTP' });
            return;
        }

        //send response
        res.status(200).json({
            type:'success',
            message: 'OTP verified successfully',
            data: {
                phone: otpExist.phone
            }
        });

    } catch (e) {
        next(e);
    }
};