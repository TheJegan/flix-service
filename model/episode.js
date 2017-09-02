let mongoose = require('mongoose');

let episodeSchema = new mongoose.Schema({
  _season: { type: mongoose.Schema.Types.ObjectId, ref: 'Season'},
  _showId: { type: mongoose.Schema.Types.ObjectId, ref: 'Show' },
  // number: Number,
  name: String,
  videoUrl: String,
  createdDate: { type: Date, default: Date.now },
  createdBy: String,
  modifiedDate: Date,
  modifiedBy: String
})

module.exports = mongoose.model("Episode", episodeSchema);