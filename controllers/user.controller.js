const db = require("../index");
const userColl = db.collection("user");
const APIError = require("../helpers/APIError");
const resPattern = require("../helpers/resPattern");
const httpStatus = require("http-status");
const query = require('../query/query');
const { generatePassword } = require("../helpers/commonfile");
const {ObjectId} = require('mongodb');

// const createUser = async (req,res,next) => {
//     try {   
//         const requestData = req.body;
//         const findOneUser = await query.findOne(userColl,{email : requestData.email})
//         console.log("findOneUser..",findOneUser);
//         if(findOneUser){
//             const message = `You have already registered with this email`;
//             return next(new APIError(`${message}`, httpStatus.BAD_REQUEST, true));
//         }
        
//         requestData.password = generatePassword(requestData.password);
//         const insertdata = await query.insert(userColl,requestData);
//         console.log("insertdata",insertdata);
//         if (insertdata.ops.length > 0) {
//             const obj = resPattern.successPattern(
//             httpStatus.OK,
//             insertdata.ops[0],
//             `success`
//             );
//             return res.status(obj.code).json({
//             ...obj,
//             });
        
//         } else {
//         const message = `Something went wrong, Please try again.`;
//         return next(new APIError(`${message}`, httpStatus.BAD_REQUEST, true));
//         }
        
//     } catch (e) {
//         console.log("e.",e);
//         return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
//     }
// }

const getAllUser = async (req,res,next) => {
    try {
        const age = req.query.age;
        const search = req.query.search;
        let pageNo = req.query.pageNo
        let limit = parseInt(req.query.limit);
console.log("log..",pageNo,limit);
        let qry = {}
        let filter = {}

        if(age){
            filter['age'] = age
        }

        if(search){
            qry = {
                "$or" : [
                    {firstname : {'$regex' : search,'$options' : 'i'}}
                ]
            }
        }
        let finalQuery = {
            "$and" : [
                filter,
                qry
            ]
        }
        
        let result = await query.findByPagination(userColl,finalQuery,{},pageNo,limit);
        console.log("result..",result)
        result.list.map((data) => {
            return delete data["password"]
        })
        const obj = resPattern.successPattern(httpStatus.OK,result,`success`);
            return res.status(obj.code).json({
            ...obj,
            });
    } catch (e) {
        console.log("e.",e);
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

const findOneUser = async (req,res,next) => {
    try {
        const id = ObjectId(req.params.id);
        const result = await query.findOne(userColl,{_id : id});
        const obj = resPattern.successPattern(httpStatus.OK,result,`success`);
        return res.status(obj.code).json({
            ...obj,
        });
    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

module.exports = {
    // createUser,
    getAllUser,
    findOneUser
}
