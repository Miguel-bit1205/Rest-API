const mongoose = require("mongoose");

const tareaSchema = new mongoose.Schema({
  descripcion: {
    type: String,
    required: true,
    trim: true,
  },
  fecha: {
    type: Date,
    required: true,
  },
  completada: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Tarea", tareaSchema);
