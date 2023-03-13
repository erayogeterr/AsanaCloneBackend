const User = require("../models/Users");


const insert = (data) => {
   const user = new User (data);
   return user.save();
}

const list = () => {
   return User.find({});
}

module.exports = {
    insert,
    list
}