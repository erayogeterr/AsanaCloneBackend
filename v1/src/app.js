const express = require("express");
const fileUpload = require("express-fileupload");
const helmet = require("helmet");
const config = require("./config");
const loaders = require("./loaders");
const events = require("./scripts/events");
const { ProjectRoutes, UserRoutes, SectionRoutes, TaskRoutes } = require("./api-routes");
const path = require("path");
config();
loaders();
events();

const app = express();
app.use("/uploads", express.static(path.join(__dirname, "./", "uploads")));
app.use(express.json()); //Body'deki bilgileri JSON olarak alıyoruz.
app.use(helmet());
app.use(fileUpload());

console.log("Selam özhan.");
console.log("Selam eray.");
console.log("SELAM SELAM 2");

app.listen(process.env.APP_PORT, () => {
  console.log("Sunucu ayağa kalktı. -> PORT NO :", process.env.APP_PORT);
  app.use("/projects", ProjectRoutes);
  app.use("/users", UserRoutes);
  app.use("/sections", SectionRoutes);
  app.use("/tasks", TaskRoutes);
});
