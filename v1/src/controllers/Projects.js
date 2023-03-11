const { insert } = require("../services/Projects")
const httpStatus = require("http-status");

const create = (req, res) => {
    insert(req.body)
    .then((response) => { 
        res.status(httpStatus.CREATED).send(response);
    })
    .catch((e) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e)
    })
}

const index = (req, res) => {
    res.status(200).send("Project index")
}

module.exports = {
    create,
    index
}