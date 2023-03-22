const httpStatus = require("http-status");
const SectionService = require("../services/SectionService")

class Section {
    create(req, res) {
        req.body.user_id = req.user;
        SectionService.create(req.body)
        .then((response) => { 
            res.status(httpStatus.CREATED).send(response);
        })
        .catch((e) => {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e)
        })
    }  
    index(req, res) {
        if(!req?.params?.projectId) return res.status(httpStatus.BAD_REQUEST).send({ error : "Proje bilgisi eksik."})
        SectionService.list(project?id : req.params.projectId)
        .then((response) => {
            res.status(httpStatus.OK).send(response);
        }).catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
    }    
    update(req, res) {
        if(!req.params?.id) {
           return res.status(httpStatus.BAD_REQUEST).send({
            message : "ID bilgisi eksik."
        });
        } 
        SectionService.update( req.params?.id, req.body)
        .then(updatedDoc => {
            if (!updateProject) return next(new ApiError("Böyle bir kayıt bulunmamaktadır", 404))
            res.status(httpStatus.OK).send(updatedDoc)
        })
        .catch((e) => next(new ApiError(e?.message)));
    }   
    deleteSection(req, res ) {
        if(!req.params?.id) {
            return res.status(httpStatus.BAD_REQUEST).send({
             message : "ID bilgisi eksik."
         });
         } 
    
         SectionService.delete(req.params?.id).then(deletedDoc => {
            if(!deletedDoc) {
               return res.status(httpStatus.NOT_FOUND).send({
                    message : "Kayıt bulunamadı."
                })
            }
            res.status(httpStatus.OK).send({message : "Sectipn silinmiştir."})
        }).catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error : "Silme sırasında bir problem oluştu."}))
    }
}

module.exports = new Section();
