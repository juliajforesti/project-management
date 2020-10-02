const express = require("express");

const app = express();

// Configura o app para entender requisições com tipo de corpo JSON
app.use(express.json());

const projectRouter = require("./routes/project.routes");

require("./configs/db.config");

app.use("/api", projectRouter);

app.listen(4000, () => console.log("running at port 4000"));
