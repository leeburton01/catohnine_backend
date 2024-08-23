const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

const dataFilePath = path.join(__dirname, "films.json");

function getData() {
  const data = fs.readFileSync(dataFilePath);
  return JSON.parse(data);
}

app.get("/api/films", (req, res) => {
  const data = getData();
  res.json(data.films);
});

app.get("/api/directors", (req, res) => {
  const data = getData();
  res.json(data.directors);
});

app.get("/api/films/:id", (req, res) => {
  const data = getData();
  const film = data.films.find((f) => f.id === parseInt(req.params.id));
  if (!film) return res.status(404).send("Film not found");
  res.json(film);
});

app.get("/api/directors/:id", (req, res) => {
  const data = getData();
  const director = data.directors.find((d) => d.id === parseInt(req.params.id));
  if (!director) return res.status(404).send("Director not found");
  res.json(director);
});

app.get("/api/composers/:id", (req, res) => {
  const data = getData();
  const composer = data.composers.find((d) => d.id === parseInt(req.params.id));
  if (!composer) return res.status(404).send("Composer not found");
  res.json(composer);
});

app.post("/api/films", (req, res) => {
  const data = getData();
  const newFilm = {
    id: data.films.length + 1,
    title: req.body.title,
    director: req.body.director,
    metascore: req.body.metascore,
    writer: req.body.writer,
    composer: req.body.composer,
    released: req.body.released,
    production_company: req.body.production_company,
    genre: req.body.genre,
    synopsis: req.body.synopsis,
    duration: req.body.duration,
    poster: req.body.poster,
    thumbnail: req.body.thumbnail,
    trailer: req.body.trailer,
    o_s_t: req.body.o_s_t,
  };
  data.films.push(newFilm);
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
  res.status(201).json(newFilm);
});

app.post("/api/directors", (req, res) => {
  const data = getData();
  const newDirector = {
    id: data.directors.length + 1,
    name: req.body.name,
    roles: req.body.roles,
    biography: req.body.biography,
    known_for: req.body.known_for,
    photo: req.body.photo,
  };
  data.directors.push(newDirector);
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
  res.status(201).json(newDirector);
});

app.put("/api/films/:id", (req, res) => {
  const data = getData();
  const filmIndex = data.films.findIndex(
    (f) => f.id === parseInt(req.params.id)
  );
  if (filmIndex === -1) return res.status(404).send("Film not found");

  data.films[filmIndex] = {
    ...data.films[filmIndex],
    ...req.body,
  };

  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
  res.json(data.films[filmIndex]);
});

app.put("/api/directors/:id", (req, res) => {
  const data = getData();
  const directorIndex = data.directors.findIndex(
    (d) => d.id === parseInt(req.params.id)
  );
  if (directorIndex === -1) return res.status(404).send("Director not found");

  data.directors[directorIndex] = {
    ...data.directors[directorIndex],
    ...req.body,
  };

  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
  res.json(data.directors[directorIndex]);
});

app.delete("/api/films/:id", (req, res) => {
  const data = getData();
  const filmIndex = data.films.findIndex(
    (f) => f.id === parseInt(req.params.id)
  );
  if (filmIndex === -1) return res.status(404).send("Film not found");

  const deletedFilm = data.films.splice(filmIndex, 1);
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
  res.json(deletedFilm[0]);
});

app.delete("/api/directors/:id", (req, res) => {
  const data = getData();
  const directorIndex = data.directors.findIndex(
    (d) => d.id === parseInt(req.params.id)
  );
  if (directorIndex === -1) return res.status(404).send("Director not found");

  const deletedDirector = data.directors.splice(directorIndex, 1);
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
  res.json(deletedDirector[0]);
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
