const express = require("express");
const app = express();
const { createLogger, format, transports } = require("winston");
const mongoose = require("mongoose");
const Station = require("./station");
const cors = require("cors");
var corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
  methods: "GET, PUT",
};

app.use(cors(corsOptions));

mongoose.connect("mongodb://localhost/pagination", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

const logLevels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
};

const logger = createLogger({
  levels: logLevels,
  format: format.combine(format.timestamp(), format.json()),
  defaultMeta: {
    service: "pagination-service",
  },
  transports: [
    new transports.File({ level: "info", filename: "pagination.log" }),
  ],
  exceptionHandlers: [
    new transports.File({ level: "error", filename: "exceptions.log" }),
  ],
  rejectionHandlers: [
    new transports.File({ level: "error", filename: "rejections.log" }),
  ],
});

app.get("/stations", paginatedResults(), cors(), (req, res) => {
  res.json(res.paginatedResults);
});

function paginatedResults() {
  return async (req, res, next) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const skipIndex = (page - 1) * limit;
    const results = {};

    try {
      results.results = await Station.find()
        .sort({ stationId: 0 })
        .limit(limit)
        .skip(skipIndex)
        .exec();
      res.paginatedResults = results;
      logger
        .child({ context: results })
        .info("Paginated stations successfully");
      next();
    } catch (e) {
      res.status(500);
      logger
        .child({ context: e })
        .error("Error Occured while fetching the data");
    }
  };
}

console.log("Server Started!");
app.listen(3000);
