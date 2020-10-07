const express = require("express");
const cors = require("cors");

const app = express();

// Configura o app para entender requisições com tipo de corpo JSON
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));

const projectRouter = require("./routes/project.routes");
const taskRouter = require("./routes/task.routes");

require("./configs/db.config");

app.use("/api", projectRouter);
app.use("/api", taskRouter);

app.listen(4000, () => console.log("running at port 4000"));
