const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  firstName: { type: String, required: true, maxLength: 100 },
  lastName: { type: String, required: true, maxLength: 100 },
  email: { type: String, required: true, maxLength: 150 },
  password: { type: String, required: true },
  memberstatus: { type: Boolean, required: true },
  adminstatus: { type: Boolean, required: true },
});

UserSchema.virtual('url').get(function getUrl() {
  // eslint-disable-next-line no-underscore-dangle
  return `/members/${this._id}`;
});

module.exports = mongoose.model('User', UserSchema);
