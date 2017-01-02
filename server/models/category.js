/*
** Category model definition
*/

//imports
var Mongoose = require('mongoose');

//definition
var CategorySchema = new Mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Field name is required']
  },
  color: {
    type: String,
    required: [false]
  },
  user_id: {
    type: Mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Field user_id is required']
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
