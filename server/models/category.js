/*
** Emotion model definition
*/

//imports
var Mongoose = require('mongoose');

//definition
var CategorySchema = new Mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  updated_at: {
    type: Date
  },
  created_at: {
    type: Date,
    default: new Date()
  }
});

module.exports = Mongoose.model('Category', CategorySchema);
