const mongoose = require("mongoose");

const archivoSchema = new mongoose.Schema({
  nombreOriginal: {
    type: String,
    required: true,
  },
  nombreGuardado: {
    type: String,
    required: true,
  },
  tipo: {
    type: String,
    required: true,
  },
  tamano: {
    type: Number,
    required: true,
  },
  ruta: {
    type: String,
    required: true,
  },
});

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
  archivos: [archivoSchema],
});

module.exports = mongoose.model("Tarea", tareaSchema);
