const e = require("express");
const express = require("express");
const sqlite3 = require("sqlite3");

const db = new sqlite3.Database(
  process.env.TEST_DATABASE || "./database.sqlite"
);

const artistsRouter = express.Router();

artistsRouter.get("/", (req, res, next) => {
  db.all(
    "SELECT * FROM Artist WHERE is_currently_employed=1;",
    (error, rows) => {
      if (error) {
        next(error);
      } else {
        res.status(200).json({ artists: rows });
      }
    }
  );
});

artistsRouter.param("artistId", (req, res, next, artistId) => {
  db.get(
    "SELECT * FROM Artist WHERE id=$artistId;",
    { $artistId: artistId },
    (error, artist) => {
      if (error) {
        next(error);
      } else if (artist) {
        req.artist = artist;
      } else {
        res.sendStatus(404);
      }
    }
  );
});

artistsRouter.get(":artistId", (req, res) => {
  res.status(200).json({ artist: req.artist });
});

const validateFields = (req, res, next) => {
  const name = req.body.artist.name;
  const dateOfBirth = req.body.artist.dateOfBirth;
  const biography = req.body.artist.biography;
  const is_currently_employed =
    req.body.artist.is_currently_employed === 0 ? 0 : 1;

  if (!name || !dateOfBirth || !biography) {
    return res.sendStatus(400);
  } else {
    next();
  }
};

artistsRouter.post("/", validateFields, (req, res, next) => {
  db.run(
    "INSERT INTO Artist (name, date_of_birth, biography, is_currently_employed) VALUES ($name, $dateOfBirth, $biography, $is_currently_employed)",
    {
      $name: name,
      $dafeOfBirth: dateOfBirth,
      $biography: biography,
      $is_currently_employed: is_currently_employed,
    },
    (error) => {
      if (error) {
        next(error);
      } else {
        db.get(
          `SELECT * FROM Artist WHERE Artist.id = ${this.lastID}`,
          (error, artist) => {
            res.status(201).json({ artist: artist });
          }
        );
      }
    }
  );
});

artistsRouter.put("/:artistId", validateFields, (req, res, next) => {
  db.run(
    "UPDATE Artist SET name=$name, date_of_birth=$dateOfBirth, biography=$biography, is_currently_employed=$isCurrentlyEmployed WHERE id=$artistId",
    {
      $name: req.name,
      $dateOfBirth: req.dateOfBirth,
      $biography: req.biography,
      $isCurrentlyEmployed: req.is_currently_employed,
    },
    (error) => {
      if (error) {
        next(error);
      } else {
        db.get(
          `SELECT * FROM Artist WHERE id = ${req.params.artistId}`,
          (error, artist) => {
            res.status(200).json({ artist: artist });
          }
        );
      }
    }
  );
});

artistsRouter.delete("/:artistId", (req, res, next) => {
  db.run(
    "UPDATE Artist SET is_currently_employed = 0 WHERE id=$artistId",
    {
      $artistId: req.params.artistId,
    },
    (error) => {
      if (error) {
        next(error);
      } else {
        db.get(
          `SELECT * FROM Artist WHERE id = ${req.params.artistId}`,
          (error, artist) => {
            res.status(200).json({ artist: artist });
          }
        );
      }
    }
  );
});

module.exports = artistsRouter;
