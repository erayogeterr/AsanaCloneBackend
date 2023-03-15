const express = require("express");
const helmet = require("helmet");
const config = require("./config");
const loaders = require("./loaders");
const events = require("./scripts/events")
const { ProjectRoutes, UserRoutes } = require("./api-routes");




config();
loaders();
events();

const app = express();
app.use(express.json()) //Body'deki bilgileri JSON olarak alıyoruz.
app.use(helmet());

console.log("Selam özhan.")

app.listen(process.env.APP_PORT, () => {
    console.log("Sunucu ayağa kalktı. -> PORT NO :", process.env.APP_PORT);
    app.use("/projects", ProjectRoutes);
    app.use("/users", UserRoutes)
})



