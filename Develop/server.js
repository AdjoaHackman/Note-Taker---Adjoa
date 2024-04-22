const express = require('express'); //loading the express library
const path = require('path'); // Node.js built-in module for handling file paths
const fs = require('fs');
const {v4: uuidv4} = require('uuid');

const app = express(); //creating an express server
const port = 3000;

// Middleware to serve static files from the public directory. Anything outside of requested server, should look in public file. Other way to look at it is, the frontend files in the public folder that are not necessarily defined in the code below
app.use(express.static(path.join(__dirname, 'public'), { extensions: ['html'] }));
app.use(express.json())
// Route for the homepage
//app.get('/', (req, res) => {
//  res.send('Welcome to my Express server!');
//});

// Route for handling other requests
app.get('/api/notes', (req, res) => {
  // notes = [
  //   {"id": 1,
  //    "title": "title1",
  //    "text": "content1"
  //   },
  //   {"id": 2,
  //    "title": "title2",
  //    "text": "content2"
  //   }
  // ]
  // reading notes
  var notes = [];

  notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));

  // returning notes
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
  title = req.body.title
  text = req.body.text
  console.log('POST title:' + title + ' text:' + text);
  // reading existing notes in
  var notes = [];

  notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));

  // notes = [ { title: "Test Title"} ]
  var newNote = {
    "id": uuidv4(), // adding this to create a unique ID
    "title": title,
    "text": text
  };
  notes.push(newNote);
  // notes = [ {}, {  ... new item ... }]
  // saving data back to the file

  fs.writeFileSync('./db/db.json', JSON.stringify(notes));

  //the fs method here is saving the notes to the db file
  ret = {
    "status": "ok"
  }
  res.json(ret);
});
//creating another get request for the notes.html file. The index.html file is automatically called
//app.get('/notes', (req, res) => {
//  res.sendFile(path.join(__dirname,'./public/notes.html'))
//});
app.delete('/api/notes/:id', (req, res) => { //adding id because the browser needs to tell us which note to delete
  console.log('DELETE ' + req.params.id);
  var notes = [];

  notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));

  // rebuild array and skip the deleted one
  newNotes = [];
  for (var i = 0; i < notes.length; i++) {
    if (notes[i].id == req.params.id)
      continue;
    newNotes.push(notes[i]);
  }
  // saving data back to the file

  fs.writeFileSync('./db/db.json', JSON.stringify(newNotes));

  ret = {
    "status": "ok"
  }
  res.json(ret);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

