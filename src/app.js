const express = require("express");
const cors = require("cors");

const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.json(repository);

});

app.put("/repositories/:id", (request, response) => {
  const { url, title, techs } = request.body;
  const { id } = request.params;

  const repository = repositories.find(repository => repository.id === id);

  if (!repository) {
    return response.status(400).send();
  }

  repositories.map(repository => {
    if (repository.id === id) {
      return {
        ...repository,
        url,
        title,
        techs
      }
    }

    return repository;
  });

  return response.json({ ...repository, url, title, techs });
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repository = repositories.find(repository => repository.id === id);

  if (!repository) {
    return response.status(400).send();
  }

  const indexRepository = repositories.indexOf(id)

  repositories.splice(indexRepository, 1);

  return response.status(204).json();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repository = repositories.find(repository => repository.id === id);

  if (!repository) {
    return response.status(400).send();
  }

  repository.likes += 1;

  return response.json(repository);
});

module.exports = app;
