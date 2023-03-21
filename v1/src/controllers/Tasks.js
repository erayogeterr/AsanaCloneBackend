const { insert, modify, list, remove, findOne } = require("../services/Tasks");
const httpStatus = require("http-status");

const create = (req, res) => {
  req.body.user_id = req.user;
  insert(req.body)
    .then((response) => {
      res.status(httpStatus.CREATED).send(response);
    })
    .catch((e) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
    });
};

const index = (req, res) => {
  if (req?.params?.projectId)
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ error: "Proje bilgisi eksik." });
  list(project ? id : req.params.projectId)
    .then((response) => {
      res.status(httpStatus.OK).send(response);
    })
    .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
};

const update = (req, res) => {
  if (!req.params?.id) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: "ID bilgisi eksik.",
    });
  }
  modify(req.body, req.params?.id)
    .then((updatedDoc) => {
      res.status(httpStatus.OK).send(updatedDoc);
    })
    .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: "Kayıt sırasında bir problem oluştu." }));
};

const deleteTask = (req, res) => {
  if (!req.params?.id) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: "ID bilgisi eksik.",
    });
  }

  remove(req.params?.id)
    .then((deletedDoc) => {
      if (!deletedDoc) {
        return res.status(httpStatus.NOT_FOUND).send({
          message: "Kayıt bulunamadı.",
        });
      }
      res.status(httpStatus.OK).send({ message: "Sectipn silinmiştir." });
    })
    .catch((e) =>
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "Silme sırasında bir problem oluştu." })
    );
};

const makeComment = (req, res) => {
  findOne({ _id : req.params.id}).then(mainTask => {
    if(!mainTask) return res.status(httpStatus.NOT_FOUND).send({ message : "Böyle bir kayır bulunmamaktadır.."});
    const comment = {
      ... req.body,
      commented_at : new Date(),
      user_id : req.user,
    };
    mainTask.comments.push(comment);
    mainTask
    .save()
    .then(updatedDoc => {
      return res.status(httpStatus.OK).send(updatedDoc)
    })
    .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: "Kayıt sırasında bir problem oluştu." }));
  })
  .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: "Kayıt sırasında bir problem oluştu." }));
};

const deleteComment = (req, res) => {
  findOne({ _id : req.params.id}).then(mainTask => {
    if(!mainTask) return res.status(httpStatus.NOT_FOUND).send({ message : "Böyle bir kayır bulunmamaktadır.."});    
    mainTask.comments = mainTask.comments.filter(c => c._id?.toString() != req.params.commentId);
    mainTask
    .save()
    .then(updatedDoc => {
      return res.status(httpStatus.OK).send(updatedDoc)
    })
    .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: "Kayıt sırasında bir problem oluştu." }));
  })
  .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: "Kayıt sırasında bir problem oluştu." }));
};

const addSubTask = (req, res) => {
  //! MainTask Çekilir.
  if(!req.params.id) return res.status(httpStatus.BAD_REQUEST).send({ message : "ID bilgisi gerekli."});
  findOne({ _id : req.params.id})
  .then(mainTask => {
    if(!mainTask) return res.status(httpStatus.NOT_FOUND).send({ message : "Böyle bir kayır bulunmamaktadır.."});
    //! SubTask Create Edilir (Task)
    insert({ ...req.body, user_id: req.user})
      .then((SubTask) => {
        //! SubTask'in Referansı MainTask üzerinde gösterilir ve update edilir.
        mainTask.sub_tasks.push(subTask);
        mainTask.save().then(updatedDoc => {
          //! Kullanıcıya yeni doküman gönderilir..
          return res.status(httpStatus.OK).send(updatedDoc);
        })
        .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: "Kayıt sırasında bir problem oluştu." }));
      })
      .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
  })
  .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: "Kayıt sırasında bir problem oluştu." }));

};

const fetchTask = (req, res) => {
  if(!req.params.id) return res.status(httpStatus.BAD_REQUEST).send({ message : "ID bilgisi gerekli."});

  findOne({ _id: req.params.id}, true)
  .then((task) => {
    if(!task) return res.status(httpStatus.NOT_FOUND).send({ message : "Böyle bir kayır bulunmamaktadır.."});
    res.status(httpStatus.OK).send(task)
  })
  .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
}

module.exports = {
  create,
  index,
  update,
  deleteTask,
  makeComment,
  deleteComment,
  addSubTask,
  fetchTask,
};
