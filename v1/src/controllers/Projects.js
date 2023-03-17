const { insert, modify, list, remove } = require("../services/Projects")
const httpStatus = require("http-status");

const create = (req, res) => {
    req.body.user_id = req.user;
    insert(req.body)
    .then((response) => { 
        res.status(httpStatus.CREATED).send(response);
    })
    .catch((e) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e)
    })
}

const index = (req, res) => {
    list().then((response) => {
        res.status(httpStatus.OK).send(response);
    }).catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
}

const update = (req, res) => {
    if(!req.params?.id) {
       return res.status(httpStatus.BAD_REQUEST).send({
        message : "ID bilgisi eksik."
    });
    } 
    modify(req.body, req.params?.id).then(updatedProject => {
        res.status(httpStatus.OK).send(updatedProject)
    }).catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error : "Kayıt sırasında bir problem oluştu."}))
};

const deleteProject = (req, res ) => {
    if(!req.params?.id) {
        return res.status(httpStatus.BAD_REQUEST).send({
         message : "ID bilgisi eksik."
     });
     } 

     remove(req.params?.id).then(deletedProject => {
        if(!deletedProject) {
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