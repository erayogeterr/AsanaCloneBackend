const { insert, modify, list, remove } = require("../services/Sections")
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
    if(req?.params?.projectId) return res.status(httpStatus.BAD_REQUEST).send({ error : "Proje bilgisi eksik."})
    list(project?id : req.params.projectId)
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
    modify(req.body, req.params?.id).then(updatedDoc => {
        res.status(httpStatus.OK).send(updatedDoc)
    }).catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error : "Kayıt sırasında bir problem oluştu."}))
};

const deleteSection = (req, res ) => {
    if(!req.params?.id) {
        return res.status(httpStatus.BAD_REQUEST).send({
         message : "ID bilgisi eksik."
     });
     } 

     remove(req.params?.id).then(deletedDoc => {
        if(!deletedDoc) {
           return res.status(httpStatus.NOT_FOUND).send({
                message : "Kayıt bulunamadı."
            })
        }
        res.status(httpStatus.OK).send({message : "Sectipn silinmiştir."})
    }).catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error : "Silme sırasında bir problem oluştu."}))
}

module.exports = {
    create,
    index,
    update,
    deleteSection,
}