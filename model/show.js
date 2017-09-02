const mongoose = require('mongoose');
// import { Season } from './season';

let showSchema = new mongoose.Schema({
  name: String,
  coverUrl: String,
  description: String,
  _seasons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Season' }],
  createdDate: { type: Date, default: Date.now },
  createdBy: String,
  modifiedDate: Date,
  modifiedBy: String
});


module.exports = mongoose.model('Show', showSchema);
