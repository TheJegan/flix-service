const mongoose = require('mongoose');

let seasonSchema = new mongoose.Schema({
  _show: { type: mongoose.Schema.Types.ObjectId, ref: 'Show', index: true  },
  name: String,
  description: String,
  coverUrl: String,
  _episodes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Episode' }],
  createdDate: { type: Date, default: Date.now },
  createdBy: String,
  modifiedDate: { type: Date, default: Date.now },
  modifiedBy: String
});

module.exports = mongoose.model('Season', seasonSchema);


