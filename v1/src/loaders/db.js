const Mongoose = require ("mongoose");
const db = Mongoose.connection;
const dbUrl = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
db.once("open", () => {
    console.log("DB Bağlantısı başarılıdır.")
})

const connectDB = async () => {
    await Mongoose.connect(dbUrl,
     {
        useNewUrlParser:true,
            useUnifiedTopology: true
    });
};

module.exports = {
    connectDB,
}


