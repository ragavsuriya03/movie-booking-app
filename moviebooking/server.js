const http = require("http");

const db = require("./models");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
    
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

const server = http.createServer(function (req, res) {
  if (req.url === "/movies") {
    res.write("All Movies Data in JSON format from Mongo DB");
    res.end();
  }

  if (req.url === "/genres") {
    res.write("All Genres Data in JSON format from Mongo DB");
    res.end();
  }

  if (req.url === "/artists") {
    res.write("All Artists Data in JSON format from Mongo DB");
    res.end();
  }
});

server.listen(9000,()=>console.log("Listening on port 9000"));

