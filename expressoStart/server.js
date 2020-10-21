const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const errorHandler = require("errorhandler");
const apiRouter = require("./api/api");

const PORT = process.env.PORT || 4000;

const app = express();

app.use(express.static("public"));
app.use(cors());
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(errorHandler());

app.use("/api", apiRouter);

app.listen(PORT, () => {
  console.log(`Server is listening on the port ${PORT}`);
});

module.exports = app;
