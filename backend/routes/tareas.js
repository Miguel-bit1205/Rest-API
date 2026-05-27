const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

const tareaController = require("../controllers/tareaController");

const almacenamiento = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    const nombre = Date.now() + "-" + file.originalname;
    cb(null, nombre);
  },
});

const upload = multer({
  storage: almacenamiento,
});

router.get("/", tareaController.listarTareas);

router.get("/:id", tareaController.obtenerTarea);

router.post("/", tareaController.crearTarea);

router.put("/:id", tareaController.actualizarTarea);

router.patch("/:id", tareaController.actualizarTarea);

router.delete("/:id", tareaController.eliminarTarea);

router.post("/:id/archivos", upload.any(), tareaController.subirArchivo);

router.get("/:id/archivos", tareaController.listarArchivos);

router.get(
  "/:id/archivos/:archivoId/download",
  tareaController.descargarArchivo,
);

router.delete("/:id/archivos/:archivoId", tareaController.eliminarArchivo);

module.exports = router;
