// ===============================================================================
// LOAD DATA
// We are linking our route to our "data" source.
// This data sources holds an array with titles and matching text.
// ===============================================================================

const database = require("../db/db.json");
const fs = require("fs");
const util = require("util");
const { v4: uuidv4 } = require("uuid");

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
    res.json(database);
  });

  // API POST Requests
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

  app.delete("/api/notes/:id", function (req, res) {
    let chosenNote = req.params.id;
    console.log(chosenNote);

    //use a for loop to "filter" through array and splice out note
    for (let i = 0; i < database.length; i++) {
      if (chosenNote === database[i].id) {
        database.splice(i, 1);
      }
    }
    //write file
    fs.writeFile("db/db.json", JSON.stringify(database, null, 1), (err) => {
      if (err) throw err;
      console.log("The file has been saved!");
    });
    //return json
    return res.json(database);
  });

  // async function deleteChosenNote(){
  //   try {
  //     const firstPromise = await readFileAsync("db/db.json", "utf8")
  //     let read = JSON.parse(firstPromise)
  //     let filter = read.filter((obj) => obj.id !== chosenNote)

  //     await writeFileAsync("db/db.json", JSON.stringify(filter), "utf8");

  //     console.log("Saved!")
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }
  // deleteChosenNote()
  // console.log(database)
};
