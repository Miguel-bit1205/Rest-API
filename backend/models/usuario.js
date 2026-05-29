const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true,
  },
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  foto: {
    type: String,
  },
});

module.exports = mongoose.model("Usuario", usuarioSchema);
