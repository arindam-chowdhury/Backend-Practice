const { PHONE_ALREADY_EXIST, USER_NOT_FOUND_ERR } = require("../../errors");
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const { createJwtToken } = require("../utils/token.util");

// create new user
exports.createNewUser = async (req, res, next) => {
    try {
        let {phone, name, password, email} = req.body;

        //check if phone already exist
        const phoneExist = await userModel.findOne({ phone });
        if(phoneExist) {
            next({ status: 400, message: PHONE_ALREADY_EXIST });
            return;
        }

        //create new user
        const createUser = new userModel({
            phone,
            name,
            password: await bcrypt.hash(password, 10),
            email,
            role: phone === process.env.ADMIN_PHONE ? 'admin' : 'user'
        });

        //save user
        const newUser = await createUser.save();

        //create jwt token
        const token = createJwtToken({ userId: newUser._id});
        res.status(201).json({
            type:'success',
            message: 'Account created successfully',
            data: {
                token: token,
                userId: newUser._id,
                name: newUser.name,
                phone: newUser.phone,
                email: newUser.email,
            }
        });
    } catch(err) {
        next(err);
    }
};

// log in user
exports.login = async (req, res, next) => {
    try {
        const { phone, password } = req.body;

        //check if user exist
        const user = await userModel.findOne({ phone });
        if(!user) {
            next({ status: 400, message: USER_NOT_FOUND_ERR });
            return;
        }

        //check password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            next({ status: 400, message: USER_NOT_FOUND_ERR });
            return;
        }

        //create jwt token
        const token = createJwtToken({ userId: user._id});
        res.status(200).json({
            type:'success',
            message: 'Logged in successfully',
            data: {
                token: token,
                userId: user._id,
                name: user.name,
                phone: user.phone,
                email: user.email,
            }
        });
    } catch (err) {
        next(err);
    }
};

// fetch current user
exports.getCurrentUser = async (req, res, next) => {
    try {
        const currentUser = res.locals.user;

        //send response
        return res.status(200).json({
            type:'success',
            message: 'User fetched successfully',
            data: {
                user: currentUser
            }
        });
    } catch(err) {
        next(err);
    }
};

// admin access only
exports.handleAdmin = async (req, res, next) => {
    try {
        const currentUser = res.locals.user;

        //send response
        return res.status(200).json({
            type:'success',
            message: 'Admin fetched successfully',
            data: {
                user: currentUser
            }
        });
    } catch (err) {
        next(err);
    }
};