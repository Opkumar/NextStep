const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  routeNumber: { type: String, required: true, unique: true },
  stops: [{
    stopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Stop' },
    sequence: { type: Number, required: true }
  }]
});

module.exports=mongoose.model("Route",routeSchema)