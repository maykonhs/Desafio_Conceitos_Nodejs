const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

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
    likes: 0
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  let newRepository = {};
  let hasId = false;

  repositories.map(repository => {
    if (repository.id === id) {
      repository.title = title || repository.title;
      repository.url = url || repository.url;
      repository.techs = techs || repository.techs;
      newRepository = repository;
      hasId = true;
    }
  });

  if (!hasId) {
    return response.status(400).send();
  }

  return response.json(newRepository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  
  let repositoryToRemove = {};
  let hasId = false;

  repositories.map(repository => {
    if (repository.id === id) {
      repositoryToRemove = repository;
      hasId = true;
    }
  });

  if (!hasId) {
    return response.status(400).send();
  }

  const index = repositories.indexOf(repositoryToRemove);

  if (index > -1) {
    repositories.splice(index, 1);
  }

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  let updatedRepository = {};
  let hasId = false;

  repositories.map(repository => {
    if (repository.id === id) {
      repository.likes += 1;
      updatedRepository = repository;
      hasId = true;
    }
  });

  if (!hasId) {
    return response.status(400).send();
  }

  return response.json(updatedRepository);
});

module.exports = app;
