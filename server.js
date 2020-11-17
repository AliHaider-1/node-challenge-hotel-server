const express = require("express");
const cors = require("cors");
var validator = require("email-validator");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function(request, response){
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});


// TODO add your routes and helper functions here
app.get("/bookings", function(request, response){
  response.send(bookings);
});

//search by a term function
function search(word) {
  return bookings.filter(item => item.title.toLowerCase().includes(word.toLowerCase())
                        ||item.firstName.toLowerCase().includes(word.toLowerCase())
                        ||item.surname.toLowerCase().includes(word.toLowerCase())
                        );
}
// search term in bookings
app.get("/bookings/search", function(request, response) {
  const searchWord = request.query.term;
  const result = search(searchWord);
  response.send(result);
});


// read booking by an id
app.get("/bookings/:id", function(request, response) {
  const id = request.params.id;
  const item = bookings.find(r => r.id == id);
  if (item){
    response.status(200).send("item found");
  }   
  else{
    response.status(404).send("item not found");
  }
});

app.post("/bookings", function(request, response) {
  const item = request.body;
   if (item.title===undefined || item.firstName===undefined || item.surname===undefined || item.email===undefined || 
      item.roomId===undefined || item.checkInDate===undefined || item.checkOutDate===undefined)
{
  response.status(400).send("Please fill all the fields")
}
else if (!validator.validate(item.email)) {
  response.send("The format of email is not valid. Please enter the correct email address")
}
else {
  const id= bookings.length+1;
  bookings.push({
    "id":id,
    "title": item.title,
    "firstName": item.firstName,
    "surname": item.surname,
    "email": item.email,
    "roomId": item.roomId,
    "checkInDate": item.checkInDate,
    "checkOutDate": item.checkOutDate
  })
  response.send("booking added successfully")
}});
// delete booking by an id
app.delete("/bookings/:id", function(request, response) {
  const id = request.params.id ;
  const item = bookings.find(r => r.id == id);
  if (item) {
    bookings.splice(bookings.indexOf(item), 1);
    response.send("item deleted");
  }
else{
  response.status(404).send("item not found");
}});
  
const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
