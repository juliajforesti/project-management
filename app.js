const express = require("express");
const cors = require("cors");

const app = express();

// Configura o app para entender requisições com tipo de corpo JSON
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));

const projectRouter = require("./routes/project.routes");

require("./configs/db.config");

app.use("/api", projectRouter);

app.listen(4000, () => console.log("running at port 4000"));
