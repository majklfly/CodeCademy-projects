const express = require("express");
const sqlite3 = require("sqlite3");

const db = new sqlite3.Database(
  process.env.TEST_DATABASE || "./database.sqlite"
);

const issuesRouter = express.Router({ mergeParams: true });

issuesRouter.param("issueId", (req, rest, next, issuesId) => {
  db.get(`SELECT * FROM Issue WHERE id=${issuesId}`, (error, data) => {
    if (error) {
      next(error);
    } else if (data) {
      next();
    } else {
      res.sendStatus(404);
    }
  });
});

issuesRouter.get("/", (req, res, next) => {
  db.all(
    `SELECT * FROM Issue WHERE id=${req.params.seriesId}`,
    (error, data) => {
      if (error) {
        next(error);
      } else {
        res.status(200).json({ issues: data });
      }
    }
  );
});

const validateFields = (req, res, next) => {
  req.name = req.body.issue.name;
  req.issueNumber = req.body.issue.issueNumber;
  req.publicationDate = req.body.issue.publicationDate;
  req.artistId = req.body.issue.artistId;

  if (!req.name || !req.issueNumber || req.publicationDate || req.artistId) {
    return res.sendStatus(400);
  } else {
    next();
  }
};

issuesRouter.post("/", validateFields, (req, res, next) => {
  db.run(
    `INSERT INTO Issue (name, issue_number, publication_date, artist_id, series_id) VALUES ("${req.name}", ${req.issueNumber}, "${req.publicationDate}", ${req.artistId}), ${req.params.seriesId}`,
    (error) => {
      if (error) {
        res.sendStatus(400);
      } else {
        db.get(
          `SELECT * FROM Issues WHERE id=${this.lastID}`,
          (error, data) => {
            if (error) {
              next(error);
            } else {
              res.status(201).json({ issues: data });
            }
          }
        );
      }
    }
  );
});

issuesRouter.put("/:issueId", validateFields, (req, res, next) => {
  db.run(
    `UPDATE Issue SET  name="${req.name}", issue_number=${req.issueNumber}, publicationDate="${req.publicationDate}", artist_id=${req.artistId}, series_id=${req.params.seriesId}`,
    (error) => {
      if (error) {
        next(error);
      } else {
        db.get(`SELECT * FROM Issue WHERE id=${this.lastID}`, (error, data) => {
          if (error) {
            next(error);
          } else {
            res.status(200).json({ issue: data });
          }
        });
      }
    }
  );
});

issuesRouter.delete("/:issueId", (req, res, next) => {
  db.delete(`SELECT * FROM Issue WHERE id=${req.params.issuesId}`, (error) => {
    if (error) {
      next(error);
    } else {
      res.sendStatus(204);
    }
  });
});

module.exports = issuesRouter;
