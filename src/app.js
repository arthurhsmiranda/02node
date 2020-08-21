const express = require("express");
const cors = require("cors");
const {uuid}  = require('uuidv4');

// const { v4: uuid } = require('uuid');

const app = express();



app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  const {title} = request.query;

  //If I want a specific title, I can pass the parameter TITLE as filter and it will filter the results, else, all the repositories will be returned
  const results = title ? repositories.filter( project => project.title.includes(title)) : repositories;


  return response.json(results);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {id: uuid(), title, url, techs, likes : 0};

  repositories.push(repository);

   return response.json(
      repository
   );
});

app.put("/repositories/:id", (request, response) => {
   
   const { id } = request.params;
   const {title, url, techs} = request.body;
   //Search the index, array position that makes easier to work with the items
   const repositoryIndex = repositories.findIndex(repository => repository.id === id);


   if (repositoryIndex < 0) {
       return response.status(400).json({ error : "Not Found"});
       
   }

   const repository = {
       id,
       title,
       url,
       techs,
       likes: repositories[repositoryIndex].likes,
   };
   //ovewrite the object inside the array on that specific index
   repositories[repositoryIndex] = repository;

   return response.json(
    repository
   );
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);


  if (repositoryIndex < 0) {
      return response.status(400).json({ error : "Not Found"});
      
  }
  //if there is a repository, get the index and remove 1 position, which is the object
  repositories.splice(repositoryIndex,1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;
  const repository = repositories.find(repository => repository.id === id);

  if (!repository) {
    return response.status(400).send();
  }


    repository.likes += 1;
  



    return response.status(200).json(
    repository
    );



});

module.exports = app;

