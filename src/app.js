const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require ('uuidv4'); //Criação de IDs únicos
// Tô apanhando pra fazer o commit e pull...


const app = express();

app.use(express.json() ); // Reconhecer JSON
app.use(cors() ); // Permite o acesso de domínios distintos

//==============================================================================

const repositories = []; // Armazena os repositórios em forma de array

//==============================================================================

// MiddleWare
function validateRepositorieId (request, response, next) {
  const { id } = request.params;

  if (!isUuid(id) ){
    return response.status(400).json( { error: 'Repositorie not found!' } ); 
    // Request interrompido! return sem a função next()
  }

  return next(); //Condição para continuação => Sem ele, o request é interrompido
};

//==============================================================================


//List
app.get("/repositories", (request, response) => {
  
  console.log ('Listing repositories!')
  return response.json (repositories);
  
});

//Create
app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const id = uuid ();
  const likes = 0;

  const repositorie = { 
    id, 
    title, 
    url,
    techs,
    likes,
  };


  repositories.push (repositorie);
  console.log (likes);
  console.log ('Creating repositorie!')
  return response.json (repositorie);

});

//Update
app.put("/repositories/:id", validateRepositorieId, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositorieIndex = repositories.findIndex (repositorie => repositorie.id === id);

  const { likes } = repositories[repositorieIndex];

  const repositorie = { 
    id, 
    title, 
    url,
    techs,
    likes,
  };

  repositories [repositorieIndex] = repositorie;
  console.log ('Repositorie updated!')
  return response.status(200).json (repositorie);
  
});

//Delete
app.delete("/repositories/:id", validateRepositorieId, (request, response) => {
  const { id } = request.params;

  const repositorieIndex = repositories.findIndex (repositorie => repositorie.id === id);

  repositories.splice (repositorieIndex, 1);
  console.log ('Repositorie deleted!')
  return response.status(204).send();

});

//Like
app.post("/repositories/:id/like", validateRepositorieId, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositorieIndex = repositories.findIndex (repositorie => repositorie.id === id);

  let { likes } = repositories[repositorieIndex];
  likes = likes + 1;

  const repositorie = { 
    id, 
    title, 
    url,
    techs,
    likes,
  };

  repositories [repositorieIndex] = repositorie;

  console.log ('Repositorie liked!');
  return response.status(200).json (repositorie);
 
});

//==============================================================================

module.exports = app;
