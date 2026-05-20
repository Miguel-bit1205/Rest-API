const Tarea = require("../models/tarea");

/*
VERSION CHATGPT:
Esta version usa destructuring, return temprano,
respuestas con ok, data y mejor manejo de errores.

async function listarTareas(req, res) {
  try {
    const tareas = await Tarea.find().sort({ fecha: 1 });

    return res.json({
      ok: true,
      total: tareas.length,
      data: tareas,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      mensaje: "Error al listar las tareas",
      error: error.message,
    });
  }
}
*/

// Version adaptada
async function listarTareas(req, res) {
  try {
    const tareas = await Tarea.find();

    res.json(tareas);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al listar las tareas",
    });
  }
}

/*
VERSION CHATGPT:
Esta version valida mejor los campos y devuelve una respuesta
mas ordenada con codigo HTTP 201 cuando crea correctamente.

async function crearTarea(req, res) {
  try {
    const { descripcion, fecha } = req.body;

    if (!descripcion || !fecha) {
      return res.status(400).json({
        ok: false,
        mensaje: "La descripcion y la fecha son obligatorias",
      });
    }

    const tarea = await Tarea.create({
      descripcion,
      fecha,
      completada: false,
    });

    return res.status(201).json({
      ok: true,
      mensaje: "Tarea creada correctamente",
      data: tarea,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      mensaje: "Error al crear la tarea",
      error: error.message,
    });
  }
}
*/

// Version adaptada
async function crearTarea(req, res) {
  try {
    const descripcion = req.body.descripcion;
    const fecha = req.body.fecha;

    if (!descripcion || !fecha) {
      res.status(400).json({
        mensaje: "Debe llenar descripcion y fecha",
      });
      return;
    }

    const tarea = new Tarea({
      descripcion: descripcion,
      fecha: fecha,
      completada: false,
    });

    await tarea.save();

    res.status(201).json({
      mensaje: "Tarea creada",
      tarea: tarea,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al crear la tarea",
    });
  }
}

/*
VERSION CHATGPT:
Esta version busca por ID y diferencia entre error de ID invalido
y tarea no encontrada.

async function obtenerTarea(req, res) {
  try {
    const tarea = await Tarea.findById(req.params.id);

    if (!tarea) {
      return res.status(404).json({
        ok: false,
        mensaje: "Tarea no encontrada",
      });
    }

    return res.json({
      ok: true,
      data: tarea,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      mensaje: "ID invalido",
      error: error.message,
    });
  }
}
*/

// Version adaptada
async function obtenerTarea(req, res) {
  try {
    const tarea = await Tarea.findById(req.params.id);

    if (!tarea) {
      res.status(404).json({
        mensaje: "Tarea no encontrada",
      });
      return;
    }

    res.json(tarea);
  } catch (error) {
    res.status(400).json({
      mensaje: "ID invalido",
    });
  }
}

/*
VERSION CHATGPT:
Esta version permite actualizar solo algunos campos,
usa runValidators para respetar el modelo y devuelve la tarea nueva.

async function actualizarTarea(req, res) {
  try {
    const tarea = await Tarea.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!tarea) {
      return res.status(404).json({
        ok: false,
        mensaje: "Tarea no encontrada",
      });
    }

    return res.json({
      ok: true,
      mensaje: "Tarea actualizada correctamente",
      data: tarea,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      mensaje: "Error al actualizar la tarea",
      error: error.message,
    });
  }
}
*/

// Version adaptada
async function actualizarTarea(req, res) {
  try {
    const tarea = await Tarea.findById(req.params.id);

    if (!tarea) {
      res.status(404).json({
        mensaje: "Tarea no encontrada",
      });
      return;
    }

    if (req.body.descripcion !== undefined) {
      tarea.descripcion = req.body.descripcion;
    }

    if (req.body.fecha !== undefined) {
      tarea.fecha = req.body.fecha;
    }

    if (req.body.completada !== undefined) {
      tarea.completada = req.body.completada;
    }

    await tarea.save();

    res.json({
      mensaje: "Tarea actualizada",
      tarea: tarea,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: "Error al actualizar la tarea",
    });
  }
}

/*
VERSION CHATGPT:
Esta version elimina directamente con findByIdAndDelete
y responde 404 si no existe.

async function eliminarTarea(req, res) {
  try {
    const tarea = await Tarea.findByIdAndDelete(req.params.id);

    if (!tarea) {
      return res.status(404).json({
        ok: false,
        mensaje: "Tarea no encontrada",
      });
    }

    return res.json({
      ok: true,
      mensaje: "Tarea eliminada correctamente",
      data: tarea,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      mensaje: "Error al eliminar la tarea",
      error: error.message,
    });
  }
}
*/

// Version adaptada
async function eliminarTarea(req, res) {
  try {
    const tarea = await Tarea.findById(req.params.id);

    if (!tarea) {
      res.status(404).json({
        mensaje: "Tarea no encontrada",
      });
      return;
    }

    await tarea.deleteOne();

    res.json({
      mensaje: "Tarea eliminada",
    });
  } catch (error) {
    res.status(400).json({
      mensaje: "Error al eliminar la tarea",
    });
  }
}

module.exports = {
  listarTareas,
  crearTarea,
  obtenerTarea,
  actualizarTarea,
  eliminarTarea,
};
