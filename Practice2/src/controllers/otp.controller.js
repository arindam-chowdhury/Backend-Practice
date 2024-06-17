const { PHONE_ALREADY_EXIST, PHONE_NOT_FOUND } = require("../../errors");
const otpModel = require("../models/otp.model");
const { sendMessage, verify } = require("../utils/otp.util");

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
        const phoneExist = await otpModel.findOne({ phone });
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
        const sendMessageRes = await sendMessage(content, next);
     
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
        const createOtp = new otpModel({
            phone,
        });

        await createOtp.save();
    }catch(err) {
        next(err);
    }
};

// verify otp
exports.verifyOtp = async (req, res, next) => {
    try {
        let { phone, otp, orderId } = req.body;

        //check if phone already exist
        const phoneExist = await otpModel.findOne({ phone });
        if(!phoneExist) {
            next({ status: 400, message: PHONE_NOT_FOUND });
            return;
        }

        const content = {
            phoneNumber: `91${phone}`,
            orderId: orderId,
            otp: otp
        } 
        
        const sendMsgRes = await verify(content, next);

                
        res.status(200).json({
            type:'success',
            message: (sendMessage.message !== undefined)? "OTP verify successfully.":sendMessage.message,
            data: {
                phone: phoneExist.phone,
                isOTPVerified: sendMsgRes.isOTPVerified
            }
        });

        // set otp varified to true
        if(sendMsgRes.isOTPVerified) {
            phoneExist.verify = true;
            await phoneExist.save();
        }

    }catch(err) {
        next(err);
    }
};



// exports.verifyOtp = async (req, res, next) => {
//     try {
//         let { phone, otp } = req.body;

//         //check if otp exist
//         const otpExist = await otpModel.findOne({ phone, otp });
//         if(!otpExist) {
//             next({ status: 400, message: 'Invalid OTP' });
//             return;
//         }

//         //send response
//         res.status(200).json({
//             type:'success',
//             message: 'OTP verified successfully',
//             data: {
//                 phone: otpExist.phone
//             }
//         });

//     } catch (e) {
//         next(e);
//     }
// };