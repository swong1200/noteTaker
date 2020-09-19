// ===============================================================================
// LOAD DATA
// We are linking our route to our "data" source.
// This data sources holds an array with titles and matching text.
// ===============================================================================

const database = require("../db/db.json");
const fs = require("fs");
const util = require("util");
const { v4: uuidv4 } = require("uuid");
const { json } = require("express");

// Turn these async functions into promises
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);


// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function (app) {
  // API GET Requests
  // Below code handles when users "visit" a page.
  // In each of the below cases when a user visits a link
  // (ex: localhost:PORT/api/admin... they are shown a JSON of the data in the table)
  // ---------------------------------------------------------------------------

  app.get("/api/notes", function (req, res) {
    async function readData() {
      try{
        let data = await readFileAsync('./db/db.json', "utf8")
        let parseData = JSON.parse(data)
        console.log(data)
        console.log(parseData)
        res.json(parseData);
      } catch(err){
        console.log(err)
      }
    }
    readData();
  });

  // API POST Request
  // Below code handles when a user submits a form and thus submits data to the server.
  // In each of the below cases, when a user submits form data (a JSON object)
  // ...the JSON is pushed to the appropriate JavaScript array
  // (ex. User fills out a reservation request... this data is then sent to the server...
  // Then the server saves the data to the tableData array)
  // ---------------------------------------------------------------------------
  app.post("/api/notes", function (req, res) {
    let notes = req.body;
    console.log(notes);
    notes.id = uuidv4();
    console.log(notes);
    database.push(notes);
    console.log(database);
    fs.writeFile("db/db.json", JSON.stringify(database), function (err) {
      if (err) {
        return console.log(err);
      }
      res.json(true);
      console.log("Success!");
    });
  });

// API DELETE Request

  app.delete("/api/notes/:id", function (req, res) {
    let chosenNote = req.params.id;
    console.log(chosenNote);
    
    async function deleteChosenNote() {
      try {
        const firstPromise = await readFileAsync("db/db.json", "utf8");
        let read = JSON.parse(firstPromise);
        let filter = read.filter((obj) => obj.id != chosenNote);
        console.log("-------------")
        console.log(filter);
        await writeFileAsync("./db/db.json", JSON.stringify(filter), "utf8");
        
        res.json(filter)
        console.log("Saved!");
      } catch (err) {
        console.log(err);
      }
    }
    deleteChosenNote();
  });
};
