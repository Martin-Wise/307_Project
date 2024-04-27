import express from "express"
import cors from "cors"

import userService from "./services/user-service.js"

const app = express()
const port = 8000

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});


app.get("/users", (req, res) => {
    const name = req.query.name;
    const job = req.query.job;

    userService
      .getUsers(name, job)
      .then((result) => {
        res.send({ users_list: result});
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send("An error ocurred in the server.")
      });

  });

app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  
  userService
    .findUserById(id)
    .then((result) => {
      if(result === undefined || result === null)
        res.status(404).send("Resource not found.");
      else
        res.status(200).send({ users_list: result });
    });

});

app.post("/users", (req, res) => {
    const userToAdd = req.body;
    
    userService
      .addUser(userToAdd)
      .then((savedUser) => {
        if(savedUser) res.status(201).send(savedUser);
        else res.status(500).end();
      });

  });

app.delete("/users/:id", (req, res) => {
    const id = req.params["id"];
    
    userService
      .findUserByIdAndDelete(id)
      .then((deletedUser) => {
        if(deletedUser) res.status(204).send("User deleted successfully, " + deletedUser);
        else res.status(404).send("Resource not found.");
      });
});

app.listen(port, () => {
    console.log(
        `Example app listening at http://localhost:${port}`
    );
});
