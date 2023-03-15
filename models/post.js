const mongoose = require('mongoose');

const { Schema } = mongoose;

const PostSchema = new Schema({
  title: { type: String, required: true, maxLength: 100 },
  text: { type: String, required: true, maxLength: 100 },
  timestamp: { type: Date, default: Date.now },
  author: { type: String },
});

PostSchema.virtual('url').get(function getUrl() {
  // eslint-disable-next-line no-underscore-dangle
  return `/posts/${this._id}`;
});

module.exports = mongoose.model('Post', PostSchema);
