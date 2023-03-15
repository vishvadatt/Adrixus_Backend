const {
  generateOTP,
  sendEmail,
  generatePassword,
  encrypt,
} = require("../helpers/commonfile");
const db = require("../index");
const userColl = db.collection("user");
const APIError = require("../helpers/APIError");
const resPattern = require("../helpers/resPattern");
const httpStatus = require("http-status");
const query = require("../query/query");
const bcrypt = require("bcrypt");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const fs = require('fs');

exports.login = async (req, res, next) => {
  try {
    const { password } = req.body;
    const reqData = { email: req.body.email };
    
    // find user
    let user = await query.findOne(userColl, reqData);
    if (!user || user.password == null) {
      const message = `Incorrect email or password.`;
      // return next(new APIError(`${message}`, httpStatus.BAD_REQUEST, true));
      return res.status(httpStatus.BAD_REQUEST).send({message})
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      
      const token = jwt.sign({  _id: user._id, mobile_no: user.mobile_no }, "supersecret")
      delete user["password"];
      let obj = resPattern.successPattern(
        httpStatus.OK,
        { user, token },
        "success"
      );
      return res.status(obj.code).json(obj);
    } else {
      const message = `Incorrect email or password..`;
      // return next(new APIError(`${message}`, httpStatus.BAD_REQUEST, true));
      return res.status(httpStatus.BAD_REQUEST).json({message : message})
    }
  } catch (e) {
    return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));

  }
};

exports.signup = async (req, res, next) => {
  try {
    const requestdata = { email: req.body.email}
    const userEmail = await query.findOne(userColl, requestdata);
    if (userEmail) {
      const message = `You have already registered with this mobile number or email`;
      return next(new APIError(`${message}`, httpStatus.BAD_REQUEST, true));
    } else {
      const user = req.body;
      user.password = generatePassword(req.body.password);
      const insertdata = await query.insert(userColl, user);
      if (insertdata.ops.length > 0) {
          const obj = resPattern.successPattern(
            httpStatus.OK,
            insertdata.ops[0],
            `success`
          );
          return res.status(obj.code).json({
            ...obj,
          });
        
      } else {
        const message = `Something went wrong, Please try again.`;
        return next(new APIError(`${message}`, httpStatus.BAD_REQUEST, true));
      }
    }
  } catch (e) {
    return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
  }
};
