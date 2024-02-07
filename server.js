const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.json()); // Enable JSON parsing for POST requests

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);
  const dataid = socket.handshake.query.dataid;
  socket.join(dataid); // Join the room based on dataid

  // Listen for the client-emitted "client-response" event
  app.get("/trigger-api/:dataid/:doorNumber", (req, res) => {
    const dataid = req.params.dataid;
    const doorNumber = req.params.doorNumber;
  
  
    io.to(dataid).emit("api-triggered", { doorNumber}, (clientResponse) => {
      socket.on("client-response", (response) => {
        console.log(`Received response from client: ${response}`);
        res.send({
          apiResponse: response
        
        });
      });
    
    });
  });
});




const PORT = process.env.PORT || 7777;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
