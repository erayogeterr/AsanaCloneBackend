const Project = require("../models/Projects");


const insert = (data) => {
   const project = new Project (data);
   return project.save();
}

const list = () => {
   return Project.find({}).populate({
      path : "user_id",
      select : "full_name email",
   });
};

const modify = (data,id) => {
   return Project.findByIdAndUpdate(id, data, { new : true});
}

module.exports = {
    insert,
    list,
    modify,
}