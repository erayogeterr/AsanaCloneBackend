const httpStatus = require("http-status");
const Service = require("../services/Projects")
const ProjectService = new Service();

const create = (req, res) => {
    req.body.user_id = req.user;
    ProjectService.create(req.body)
    .then((response) => { 
        res.status(httpStatus.CREATED).send(response);
    })
    .catch((e) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e)
    })
}

const index = (req, res) => {
   ProjectService.list()
   .then((response) => {
        res.status(httpStatus.OK).send(response);
    }).catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
}

const update = (req, res) => {
    if(!req.params?.id) {
       return res.status(httpStatus.BAD_REQUEST).send({
        message : "ID bilgisi eksik."
    });
    } 
    ProjectService.update(req.params?.id, req.body)
    .then(updatedProject => {
        res.status(httpStatus.OK).send(updatedProject)
    })
    .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error : "Kayıt sırasında bir problem oluştu."}))
};

const deleteProject = (req, res ) => {
    if(!req.params?.id) {
        return res.status(httpStatus.BAD_REQUEST).send({
         message : "ID bilgisi eksik."
     });
     } 

     ProjectService.delete(req.params?.id).then(deletedItem => {
        if(!deletedItem) {
           return res.status(httpStatus.NOT_FOUND).send({
                message : "Kayıt bulunamadı."
            })
        }
        res.status(httpStatus.OK).send({message : "Proje silinmiştir."})
    }).catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error : "Silme sırasında bir problem oluştu."}))
}

module.exports = {
    create,
    index,
    update,
    deleteProject,
}