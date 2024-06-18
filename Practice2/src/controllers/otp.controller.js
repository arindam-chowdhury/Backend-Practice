const { PHONE_ALREADY_EXIST, PHONE_NOT_FOUND, EMAIL_NOT_FOUND, EMAIL_ALREADY_EXIST } = require("../../errors");
const otpModel = require("../models/otp.model");
const userModel = require("../models/user.model");
const { verifyOTPForMobile, sendMessageToMobile, sendMessageToEmail, verifyOTPForEmail } = require("../utils/otp.util");

// send opt to phone number
exports.sendOtpPhoneNumber = async (req, res, next) => {
    try {
        let { phone } = req.body;

        //check if it is a valid phone number
        const regexPhoneNumber = /^[6-9]\d{9}$/;
        const isValidPhone = regexPhoneNumber.test(phone);
        if(!isValidPhone) {
            next({ status: 400, message: PHONE_NOT_FOUND });
            return;
        }

        //check if phone already exist
        const phoneExist = await userModel.findOne({ phone });
        if(phoneExist) {
            next({ status: 400, message: PHONE_ALREADY_EXIST });
            return;
        }

        // send otp message through OTPless service
        const content = {
            phoneNumber: `91${phone}`,
            channel: "SMS",
            expiry: 300,
            otpLength: 4
        }
        const sendMessageRes = await sendMessageToMobile(content, next);
     
        //send response
        res.status(200).json({
            type:'success',
            message: 'OTP sent successfully',
            data: {
                phone: phone,
                optless_data_orderId: sendMessageRes.orderId
            }
        });
        // save phone number to
        const createUser = new userModel({
            phone,
        });

        await createUser.save();
    }catch(err) {
        next(err);
    }
};

// verify otp for phone number
exports.verifyOtpForMobile = async (req, res, next) => {
    try {
        let { phone, otp, orderId } = req.body;

        //check if phone already exist
        const phoneExist = await userModel.findOne({ phone });
        if(!phoneExist) {
            next({ status: 400, message: PHONE_NOT_FOUND });
            return;
        }

        const content = {
            phoneNumber: `91${phone}`,
            orderId: orderId,
            otp: otp
        } 
        
        const sendMsgRes = await verifyOTPForMobile(content, next);

                
        res.status(200).json({
            type:'success',
            message: (sendMsgRes.message === undefined)? "OTP verify successfully.":sendMsgRes.message,
            data: {
                phone: phoneExist.phone,
                isOTPVerified: sendMsgRes.isOTPVerified
            }
        });

        // set otp varified to true
        if(sendMsgRes.isOTPVerified) {
            phoneExist.verifyPhone = true;
            await phoneExist.save();
        }

    }catch(err) {
        next(err);
    }
};

//send otp to email address
exports.sendOtpEmail = async (req, res, next) => {
    try {
        let { email, phone } = req.body;

        //check if it is a valid email
        const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const isValidEmail = regexEmail.test(email);
        if(!isValidEmail) {
            next({ status: 400, message: EMAIL_NOT_FOUND });
            return;
        }

        //check if phone is already exists
        const phoneExist = await userModel.findOne({ phone });
        if(!phoneExist) {
            next({ status: 400, message: PHONE_NOT_FOUND });
            return;
        }

        //check if phone number verified or not
        if(!phoneExist.verifyPhone) {
            next({ status: 400, message: "Phone number not verified"});
            return;
        }

        //check if the email is already exists
        const emailExist = await userModel.findOne({ email });
        if(emailExist) {
            next({ status: 400, message: EMAIL_ALREADY_EXIST });
            return;
        }

        // send otp message through OTPless service
        const content = {
            email: email,
            channel: "EMAIL",
            expiry: 300,
            otpLength: 4
        }
        const sendMessageRes = await sendMessageToEmail(content, next);

        //send response
        res.status(200).json({
            type:'success',
            message: 'OTP sent successfully',
            data: {
                email: email,
                optless_data_orderId: sendMessageRes.orderId
            }
        });
        // save email address
        phoneExist.email = email;
        await phoneExist.save();

    } catch (err) {
        next(err);
    }
};

//verify opt for email address
exports.verifyOtpForEmail = async (req, res, next) => {
    try {
        let {email, phone, otp, orderId} = req.body;

        //check if phone is already exists
        const phoneExist = await userModel.findOne({ phone });
        if(!phone) {
            next({ status: 404, message: PHONE_NOT_FOUND});
            return;
        }

        //check if the email is already exists
        const emailExist = await userModel.findOne({ email });
        if(!emailExist) {
            next({ status: 400, message: EMAIL_NOT_FOUND });
            return;
        }

        //check otp through OTPLess
        const content = {
            email: email,
            orderId: orderId,
            otp: otp
        };
        const sendMsgRes = await verifyOTPForEmail(content, next);

        res.status(200).json({
            type:'success',
            message: (sendMsgRes.message === undefined)? "OTP verify successfully.":sendMsgRes.message,
            data: {
                phone: emailExist.phone,
                email: emailExist.email,
                isOTPVerified: sendMsgRes.isOTPVerified
            }
        });

        //set otp varified to true
        if(sendMsgRes.isOTPVerified) {
            emailExist.verifyEmail = true;
            await emailExist.save();
        }
    } catch (err) {
        next(err);
    }
};