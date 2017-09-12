var mongoose = require('mongoose');
var q = require('q');

var userSchema = new mongoose.Schema({
  oauthID: String,
  username: { type: String, unique: true },
  password: String,
  displayName: String,
  createdBy: String,
  createdDateTime: { type: Date, default: Date.now },
  lastModifiedBy: String,
  lastModifiedDate: { type: Date },
  lastLoginDate: { type: Date, default: Date.now },
  isApproved: { type: Boolean, default: false },
  role: { type: String, default: "normal" }, //admin
  isSuspended: { type: Boolean }, default: false,
  token: String,
  notes: String,
  saltValue: "",
});


// module.exports = mongoose.model('User', userSchema);

let User = mongoose.model('User', userSchema);
// let User = {};
// User.findOne = UserModel.findOne;

//Get all users
User.findAll = function () {
  var defer = q.defer();
  // User
  User.find({}, (err, u) => {
    if (!err) {
      defer.resolve(u);
    } else {
      defer.reject(err);
    }
  });

  return defer.promise;
}

User.findById = function(id){
  var defer = q.defer();
  // User
  User.find({_id: id}, (err, u) => {
    if (!err) {
      defer.resolve(u);
    } else {
      defer.reject(err);
    }
  });

  return defer.promise;
}

// User.UpdateById = function (id) {

// }

// User.create = function () {

// }

module.exports = User;