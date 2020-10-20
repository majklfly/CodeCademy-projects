const { json } = require("body-parser");
const express = require("express");
const sqlite3 = require("sqlite3");

const db = new sqlite3.Database(
  process.env.TEST_DATABASE || "./database.sqlite"
);

const seriesRouter = express.Router();

const issuesRouter = require("./issues");

seriesRouter.use("/:seriesId/issues", issuesRouter);

seriesRouter.get("/", (req, res) => {
  db.all("SELECT * FROM Series", (error, rows) => {
    if (error) {
      res.status(400).send(error.message);
    } else {
      res.status(200).json({ series: rows });
    }
  });
});

seriesRouter.param("seriesId", (req, res, next, seriesId) => {
  db.get(`SELECT * FROM Series WHERE id=${seriesId}`, (error, row) => {
    if (error) {
      next(error);
    } else if (row) {
      req.series = row;
      next();
    } else {
      res.sendStatus(404);
    }
  });
});

seriesRouter.get("/:seriesId", (req, res) => {
  res.status(200).json({ series: req.series });
});

const validateFields = (req, res, next) => {
  req.name = req.body.series.name;
  req.description = req.body.series.description;

  if (!req.name || !req.description) {
    res.sendStatus(400);
  } else {
    next();
  }
};

seriesRouter.post("/", validateFields, (req, res, next) => {
  db.run(
    `INSERT INTO Series (name, description) VALUES ("${req.name}", "${req.description}")`,
    (error) => {
      if (error) {
        next(error);
      } else {
        db.get(
          `SELECT * FROM Series WHERE id=${this.lastID}`,
          (error, series) => {
            res.status(201).json({ series: series });
          }
        );
      }
    }
  );
});

seriesRouter.put("/:seriesId", validateFields, (req, res, next) => {
  db.run(
    `UPDATE Series SET name= "${req.name}", description = "${req.description}"
    WHERE id = ${req.params.seriesId}`,
    (error) => {
      if (error) {
        next(error);
      } else {
        db.get(
          `SELECT * FROM Series WHERE id=${req.params.seriesId}`,
          (error, row) => {
            res.send(200).json({ series: row });
          }
        );
      }
    }
  );
});

seriesRouter.delete("/:seriesId", (req, res, next) => {
  db.delete(
    `SELECT * FROM Series WHERE id = ${req.params.seriesId}`,
    (error) => {
      if (error) {
        next(error);
      } else {
        res.sendStatus(204);
      }
    }
  );
});

module.exports = seriesRouter;
