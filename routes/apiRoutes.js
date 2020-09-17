// ===============================================================================
// LOAD DATA
// We are linking our route to our "data" source.
// This data sources holds an array with titles and matching text.
// ===============================================================================

const database = require("../db/db.json");
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');
// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function(app) {
// API GET Requests
// Below code handles when users "visit" a page.
// In each of the below cases when a user visits a link
// (ex: localhost:PORT/api/admin... they are shown a JSON of the data in the table)
// ---------------------------------------------------------------------------

  app.get("/api/notes", function(req, res) {
    res.json(database);
  });

// API POST Requests
// Below code handles when a user submits a form and thus submits data to the server.
// In each of the below cases, when a user submits form data (a JSON object)
// ...the JSON is pushed to the appropriate JavaScript array
// (ex. User fills out a reservation request... this data is then sent to the server...
// Then the server saves the data to the tableData array)
// ---------------------------------------------------------------------------
  app.post("/api/notes", function(req, res) {
    let notes = req.body;
    console.log(notes);
    
    notes.id = uuidv4();
    
    console.log(notes);
    database.push(notes);
    console.log(database);
    fs.writeFile("db/db.json", JSON.stringify(database), function(err) {
      if (err) {
        return console.log(err);
      }
      res.json(true);
      console.log("Success!");
    });
  });

  app.delete("/api/notes/:id", function(req, res) {
    let chosenNote = (req.params.id);
    console.log(chosenNote);
    fs.readFile("db/db.json", function(err, data) {
      if (err) throw err;
      let response = JSON.parse(data);
      console.log(response);
      let result = response.filter(obj => obj.id !== chosenNote);
      console.log(result);
      fs.writeFile("db/db.json", JSON.stringify(result), function(err) {
        if (err) {
          return console.log(err);
        }
        console.log("Success!");
      });
      
    })
    res.json(database);
  });
};