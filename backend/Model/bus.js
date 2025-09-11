const mongoose= require("mongoose");

const busSchema = new mongoose.Schema({
  busNumber: { type: String, required: true, unique: true },
  licensePlate: { type: String, required: true, unique: true },
  currentRoute: { type: mongoose.Schema.Types.ObjectId, ref: 'Route' },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  lastUpdated: { type: Date, default: Date.now }
});

// Geospatial index on the location field for fast queries
busSchema.index({ "location": "2dsphere" });

module.exports=mongoose.model("Bus",busSchema)
