const Project = require("../models/Projects");


const insert = (projectData) => {
   const project = new Project (projectData);
   return project.save();
}

module.exports = {
    insert,
}