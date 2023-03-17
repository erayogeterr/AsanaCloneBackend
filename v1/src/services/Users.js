const User = require("../models/Users");


const insert = (data) => {
   const user = new User (data);
   return user.save();
}

const list = () => {
   return User.find({});
}

const loginUser = (loginData) => {
    return User.findOne(loginData)
}

const modify = (where,updateData) => {
    //const updateData = Object.keys(data).reduce((obj,key) => {
      //  if(key != "password") obj[key] = data[key];
       // return obj;
    //});
    return User.findOneAndUpdate(where,updateData, {new : true});
};


const remove = (id) => {
    return User.findByIdAndDelete(id);
 }

module.exports = {
    insert,
    list,
    loginUser,
    modify,
    remove,
}