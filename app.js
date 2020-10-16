require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require('path');
const bodyParser = require("body-parser");



const app = express();

// Configura o app para entender requisições com tipo de corpo JSON
app.use(express.json());
app.use(cors({ origin: process.env.CORS }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


const projectRouter = require("./routes/project.routes");
const taskRouter = require("./routes/task.routes");
const authRouter = require("./routes/auth.routes");

require("./configs/db.config");

require("./configs/passport.config")(app);

app.use("/api", projectRouter);
app.use("/api", taskRouter);
app.use("/api", authRouter);


// app.use((req, res, next)=> {
//   const hostURL = req.get('host')
//   console.log(hostURL)
//   if (hostURL.includes('/api')){
//     return res.sendFile(__dirname + '/public/index.html')
//   }
//   return
// })



app.listen(process.env.PORT, () => console.log(`running at port ${process.env.PORT}`));
