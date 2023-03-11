const express = require("express");
const helmet = require("helmet");
const config = require("./config");
const { ProjectRoutes } = require("./api-routes");
const loaders = require("./loaders");


config();
loaders();

const app = express();
app.use(express.json()) //Body'deki bilgileri JSON olarak alıyoruz.
app.use(helmet());

app.listen(process.env.APP_PORT, () => {
    console.log("Sunucu ayağa kalktı. -> PORT NO :", process.env.APP_PORT);
    app.use("/projects/", ProjectRoutes.router);
})



