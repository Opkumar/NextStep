const express = require("express")
const dotenv = require("dotenv");
dotenv.config()
const connectDB = require("./connection");
const http = require("http")
const cors = require('cors');
const { Server } = require('socket.io')
const busRoutes=require("./Routes/busRoute")
const Bus=require("./Model/bus")

const app = express();
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
})


app.use(express.json())
app.use(cors());

const PORT = 5000
const connectionString = process.env.MONGO_URI


connectDB(connectionString)
    .then(() => {
        console.log("DB Connected")
        server.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}`));
    })
    .catch((err) => {
        console.log(err)
    })

app.get("/check", (req, res) => {
    res.send("Server is running 🚀");
});


app.use('/api', busRoutes);

// Socket.IO for Real-time location updates
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('updateLocation', async (data) => {
   
    const { busNumber, lat, lng } = data;
    
    await Bus.updateOne(
      { busNumber: busNumber },
      { 'location.coordinates': [lng, lat], lastUpdated: new Date() }
    );
    
    io.emit('busLocationUpdate', {
      busNumber,
      lat,
      lng
    });
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

