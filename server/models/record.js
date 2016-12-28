/*
** Emotion model definition
*/

//imports
var Mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var moment = require('moment');

//definition
var RecordSchema = new Mongoose.Schema({
  amount: {
    type: Number,
    required: [true, 'Field amount is required']
  },
  entry_date: {
    type: Date,
    required: [true, 'Field entry_date is required']
  },
  payment_method: {
    type: Number,
    required: [true, 'Field payment_method is required']
  },
  kind: {
    type: Number,
    required: [true, 'Field kind is required']
  },
  category_id: {
    type: Mongoose.Schema.ObjectId,
    ref: 'Category',
    required: [true, 'Field category_id is required']
  },
  user_id: {
    type: Mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Field user_id is required']
  },
  notes: {
    type: String
  },
  updated_at: {
    type: Date
  },
  created_at: {
    type: Date,
    default: new Date()
  }
});

// add mongoosePaginate plugin
RecordSchema.plugin(mongoosePaginate);

module.exports = Mongoose.model('Record', RecordSchema);
