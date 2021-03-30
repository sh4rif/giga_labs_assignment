const fs = require("fs");
const path = require("path");

const { Movie } = require("../models");
const { create_filename, get_file_extension } = require("../utils");

class MovieController {
  constructor() {
    const dir = path.join(__dirname, "..", "movie_images");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  }
  async index(req, res) {
    try {
      const movies = await Movie.findAll({
        attributes: ["id", "title", "image", "rating"],
      });
      res.json(movies);
    } catch (error) {
      console.log("error occured:", error);
      res.sendStatus(500);
    }
  }

  async show(req, res) {
    try {
      const movie = await Movie.findOne({ where: { id: req.params.id } });
      res.json(movie);
    } catch (error) {
      console.log("error occured:", error);
      res.sendStatus(500);
    }
  }

  async store(req, res) {
    const file = req.files && req.files.image;
    if (file && !file.mimetype.startsWith("image")) {
      return res.json({ message: "invalid file type" });
    }

    const { title, rating } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    const fields = { title, rating };

    if (file) {
      const file_name = create_filename(title);
      const extension = get_file_extension(file.name);
      const filename = `${file_name}.${extension}`;

      const location = path.join(__dirname, "..", "movie_images", filename);
      file.mv(location, (err) => {
        if (err) return res.sendStatus(500);
      });
      fields.image = filename;
    }

    try {
      // await Movie.create({ title, image: filename, rating });
      await Movie.create(fields);
      return res.sendStatus(201);
    } catch (error) {
      console.log("error occured:", error);
      return res.sendStatus(500);
    }
  }

  async update(req, res) {
    try {
      const movie = await Movie.findOne({ where: { id: req.params.id } });
      if (!movie) {
        return res.sendStatus(404);
      }

      const { title, rating } = req.body;
      const updateFields = {};

      if (title) updateFields.title = title;
      if (rating) updateFields.rating = rating;

      const file = req.files && req.files.image;
      if (file) {
        const file_name = create_filename(title || movie.title);
        const extension = get_file_extension(file.name);
        const filename = `${file_name}.${extension}`;
        const location = path.join(__dirname, "..", "movie_images", filename);

        // upload new file
        file.mv(location, (err) => {
          if (err) return res.sendStatus(500);
        });
        // delete old file if it already had it
        if (movie.image && movie.image.trim() !== "") {
          const loc = path.join(__dirname, "..", "movie_images", movie.image);
          await fs.unlinkSync(loc);
        }
        updateFields.image = filename;
      }

      if (Object.keys(updateFields).length) {
        movie.update(updateFields);
      }
      return res.json(movie);
    } catch (error) {
      console.log("error occured:", error);
      res.sendStatus(500);
    }
  }
}

const movieController = new MovieController();

module.exports = movieController;
