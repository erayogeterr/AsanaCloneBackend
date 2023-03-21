const httpStatus = require("http-status");
const { passwordToHash, generateAccessToken, generateRefreshToken } = require("../scripts/utils/helper")
const uuid = require("uuid");
const eventEmitter = require("../scripts/events/eventEmitter")
const path = require("path");

const Service = require("../services/Users");
const UserService = new Service();

const projectService = require("../services/Projects");
const ProjectService = new projectService();

const create = (req, res) => {
    req.body.password = passwordToHash(req.body.password);
    UserService.create(req.body)
    .then((response) => { 
        res.status(httpStatus.CREATED).send(response);
    })
    .catch((e) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e)
    })
}

const index = (req, res) => {
    UserService.list().then((response) => {
        res.status(httpStatus.OK).send(response);
    }).catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
}

const login = (req, res) => {
    req.body.password = passwordToHash(req.body.password);
    UserService.findOne(req.body) 
        .then((user) => {
            if(!user) return res.status(httpStatus.NOT_FOUND).send({ message : "Böyle bir kullanıcı yoktur."})
            user = {
                ...user.toObject(),
                tokens : {
                    access_token : generateAccessToken(user),
                    refresh_token : generateRefreshToken(user),
                },
            };
            res.status(httpStatus.OK).send(user);
        })
        .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
};


const projectList = (req, res) => {
   ProjectService.list()({ user_id: req.user?._id})
   .then((projects) => {
    res.status(httpStatus.OK).send(projects);
   })
   .catch(() => 
   res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
    error: "Projeleri getirirken beklenmedik bir hata oluştu."
   })
   );
};

const resetPassword = (req, res) => {
   const new_password = uuid.v4()?.split("-")[0] || `usr-${new Date().getTime()}`;
   UserService.updateWhere({ email: req.body.email}, { password: passwordToHash(new_password)})
   .then((updatedUser) => {
    if (!updatedUser) return res.status(httpStatus.NOT_FOUND).send({ error : "Böyle bir kullanıcı bulunmamaktadır."});
    eventEmitter.emit("send_email", {
        to: updatedUser.email,
        subject: "Şifre Sıfırlama",
        html : `Talebiniz üzerine şifre sıfırlama işleminiz gerçekleşmiştir. <br /> Giriş yaptıktan sonra şifrenizi değiştirmeyi unutmayım! <br /> Yeni Şifreniz : <b>${new_password}`
    });
    res.status(httpStatus.OK).send({
        message: "Şifre sıfırlama işlemi için sisteme kayıtlı e-posta adresinize gereken bilgileri gönderdik."
    })
   })
   .catch(() => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error : "Şifre resetleme sırasında sorun çıktı."}))
  
};

const update = (req, res) => {
    UserService.update(req.user?.id, req.body)
        .then((updatedUser) => {
            res.status(httpStatus.OK).send(updatedUser);
        })
        .catch(() => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: "Güncelleme işlemi sırasında hata alındı."}));
};

const changePassword = (req, res) => {
    req.body.password = passwordToHash(req.body.password);
    //!.. ui ile yapılacak şifre karşılaştırma kuralları..
    UserService.update(req.user?.id, req.body)
        .then((updatedUser) => {
            res.status(httpStatus.OK).send(updatedUser);
        })
        .catch(() => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: "Güncelleme işlemi sırasında hata alındı."}));
};

const deleteUser = (req, res ) => {
    if(!req.params?.id) {
        return res.status(httpStatus.BAD_REQUEST).send({
         message : "ID bilgisi eksik."
     });
     } 

     UserService.delete(req.params?.id).then(deletedItem => {
        if(!deletedItem) {
           return res.status(httpStatus.NOT_FOUND).send({
                message : "Kayıt bulunamadı."
            })
        }
        res.status(httpStatus.OK).send({message : "User silinmiştir."})
    }).catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error : "Silme sırasında bir problem oluştu."}))
}

const updateProfileImage = (req,res) => {
    if(!req?.files?.profile_image) {
        return res.status(httpStatus.BAD_REQUEST).send({error : "Bu işlemi yapabilmek için yeterli veriye sahip değilsin."})
    }
    const extension = path.extname(req.files.profile_image.name);
    const fileName = `${req?.user._id}${extension}`;
    const folderPath = path.join(__dirname, "../", "uploads/users", fileName);
    req.files.profile_image.mv(folderPath, function (err) {
        if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: err});
        UserService.update(req.user._id, {profile_image: fileName})
        .then((updatedUser) => {
            res.status(httpStatus.OK).send(updatedUser);
        })
        .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({error : "Upload başarılı fakat kayıt sırasında hata oldu."}))
    });
};

module.exports = {
    create,
    index,
    login,
    projectList,
    resetPassword,
    update,
    deleteUser,
    changePassword,
    updateProfileImage,
}