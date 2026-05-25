const Tarea = require("../models/tarea");

function crearLinksTarea(id) {
  return {
    self: `/api/tareas/${id}`,
    update: `/api/tareas/${id}`,
    delete: `/api/tareas/${id}`,
  };
}

function crearMetadata(status) {
  return {
    status: status,
    timestamp: new Date().toISOString(),
  };
}

function responderError(res, status, mensaje) {
  return res.status(status).json({
    ok: false,
    mensaje: mensaje,
    metadata: crearMetadata(status),
  });
}

/*
VERSION CHATGPT:
Esta version lista las tareas ordenadas por fecha, devuelve una
estructura REST mas completa, agrega metadatos, enlaces y evita
devolver campos internos como __v.

async function listarTareas(req, res) {
  try {
    const tareas = await Tarea.find()
      .select("descripcion fecha completada")
      .sort({ fecha: 1 });

    const data = tareas.map((tarea) => ({
      id: tarea._id,
      descripcion: tarea.descripcion,
      fecha: tarea.fecha,
      completada: tarea.completada,
      links: crearLinksTarea(tarea._id),
    }));

    return res.status(200).json({
      ok: true,
      mensaje: "Lista de tareas obtenida correctamente",
      metadata: {
        status: 200,
        total: data.length,
        timestamp: new Date().toISOString(),
      },
      data: data,
      links: {
        self: "/api/tareas",
        create: "/api/tareas",
      },
    });
  } catch (error) {
    return responderError(res, 500, "Error al listar las tareas");
  }
}
*/

// Version adaptada
async function listarTareas(req, res) {
  try {
    const tareas = await Tarea.find().select("descripcion fecha completada");

    const data = tareas.map((tarea) => {
      return {
        id: tarea._id,
        descripcion: tarea.descripcion,
        fecha: tarea.fecha,
        completada: tarea.completada,
        links: crearLinksTarea(tarea._id),
      };
    });

    res.status(200).json({
      ok: true,
      mensaje: "Lista de tareas obtenida",
      metadata: {
        status: 200,
        total: data.length,
        timestamp: new Date().toISOString(),
      },
      data: data,
      links: {
        self: "/api/tareas",
        create: "/api/tareas",
      },
    });
  } catch (error) {
    responderError(res, 500, "Error al listar las tareas");
  }
}

/*
VERSION CHATGPT:
Esta version usa destructuring, Tarea.create(), return temprano
y devuelve una respuesta REST completa con metadata, data y links.

async function crearTarea(req, res) {
  try {
    const { descripcion, fecha } = req.body;

    if (!descripcion || !fecha) {
      return responderError(res, 400, "La descripcion y la fecha son obligatorias");
    }

    const tarea = await Tarea.create({
      descripcion,
      fecha,
      completada: false,
    });

    return res.status(201).json({
      ok: true,
      mensaje: "Tarea creada correctamente",
      metadata: crearMetadata(201),
      data: {
        id: tarea._id,
        descripcion: tarea.descripcion,
        fecha: tarea.fecha,
        completada: tarea.completada,
      },
      links: crearLinksTarea(tarea._id),
    });
  } catch (error) {
    return responderError(res, 500, "Error al crear la tarea");
  }
}
*/

// Version adaptada
async function crearTarea(req, res) {
  try {
    const descripcion = req.body.descripcion;
    const fecha = req.body.fecha;

    if (!descripcion || !fecha) {
      responderError(res, 400, "Debe llenar descripcion y fecha");
      return;
    }

    const tarea = new Tarea({
      descripcion: descripcion,
      fecha: fecha,
      completada: false,
    });

    await tarea.save();

    res.status(201).json({
      ok: true,
      mensaje: "Tarea creada",
      metadata: crearMetadata(201),
      data: {
        id: tarea._id,
        descripcion: tarea.descripcion,
        fecha: tarea.fecha,
        completada: tarea.completada,
      },
      links: crearLinksTarea(tarea._id),
    });
  } catch (error) {
    responderError(res, 500, "Error al crear la tarea");
  }
}

/*
VERSION CHATGPT:
Esta version busca una tarea por ID, devuelve data con links
para ver, actualizar o eliminar el recurso, y diferencia 404 de 400.

async function obtenerTarea(req, res) {
  try {
    const tarea = await Tarea.findById(req.params.id).select(
      "descripcion fecha completada"
    );

    if (!tarea) {
      return responderError(res, 404, "Tarea no encontrada");
    }

    return res.status(200).json({
      ok: true,
      mensaje: "Tarea obtenida correctamente",
      metadata: crearMetadata(200),
      data: {
        id: tarea._id,
        descripcion: tarea.descripcion,
        fecha: tarea.fecha,
        completada: tarea.completada,
      },
      links: crearLinksTarea(tarea._id),
    });
  } catch (error) {
    return responderError(res, 400, "ID invalido");
  }
}
*/

// Version adaptada
async function obtenerTarea(req, res) {
  try {
    const tarea = await Tarea.findById(req.params.id).select(
      "descripcion fecha completada",
    );

    if (!tarea) {
      responderError(res, 404, "Tarea no encontrada");
      return;
    }

    res.status(200).json({
      ok: true,
      mensaje: "Tarea obtenida",
      metadata: crearMetadata(200),
      data: {
        id: tarea._id,
        descripcion: tarea.descripcion,
        fecha: tarea.fecha,
        completada: tarea.completada,
      },
      links: crearLinksTarea(tarea._id),
    });
  } catch (error) {
    responderError(res, 400, "ID invalido");
  }
}

/*
VERSION CHATGPT:
Esta version actualiza directamente con findByIdAndUpdate(),
usa runValidators para respetar el modelo, new:true para devolver
la tarea ya actualizada, y responde con metadata y links.

async function actualizarTarea(req, res) {
  try {
    const tarea = await Tarea.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).select("descripcion fecha completada");

    if (!tarea) {
      return responderError(res, 404, "Tarea no encontrada");
    }

    return res.status(200).json({
      ok: true,
      mensaje: "Tarea actualizada correctamente",
      metadata: crearMetadata(200),
      data: {
        id: tarea._id,
        descripcion: tarea.descripcion,
        fecha: tarea.fecha,
        completada: tarea.completada,
      },
      links: crearLinksTarea(tarea._id),
    });
  } catch (error) {
    return responderError(res, 400, "Error al actualizar la tarea");
  }
}
*/

// Version adaptada
async function actualizarTarea(req, res) {
  try {
    const tarea = await Tarea.findById(req.params.id);

    if (!tarea) {
      responderError(res, 404, "Tarea no encontrada");
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

    res.status(200).json({
      ok: true,
      mensaje: "Tarea actualizada",
      metadata: crearMetadata(200),
      data: {
        id: tarea._id,
        descripcion: tarea.descripcion,
        fecha: tarea.fecha,
        completada: tarea.completada,
      },
      links: crearLinksTarea(tarea._id),
    });
  } catch (error) {
    responderError(res, 400, "Error al actualizar la tarea");
  }
}

/*
VERSION CHATGPT:
Esta version elimina con findByIdAndDelete(), hace la operacion
en una sola llamada a MongoDB y devuelve enlaces para listar o crear
otra tarea.

async function eliminarTarea(req, res) {
  try {
    const tarea = await Tarea.findByIdAndDelete(req.params.id).select(
      "descripcion fecha completada"
    );

    if (!tarea) {
      return responderError(res, 404, "Tarea no encontrada");
    }

    return res.status(200).json({
      ok: true,
      mensaje: "Tarea eliminada correctamente",
      metadata: crearMetadata(200),
      data: {
        id: tarea._id,
        descripcion: tarea.descripcion,
      },
      links: {
        list: "/api/tareas",
        create: "/api/tareas",
      },
    });
  } catch (error) {
    return responderError(res, 400, "Error al eliminar la tarea");
  }
}
*/

// Version adaptada
async function eliminarTarea(req, res) {
  try {
    const tarea = await Tarea.findById(req.params.id);

    if (!tarea) {
      responderError(res, 404, "Tarea no encontrada");
      return;
    }

    await tarea.deleteOne();

    res.status(200).json({
      ok: true,
      mensaje: "Tarea eliminada",
      metadata: crearMetadata(200),
      data: {
        id: tarea._id,
        descripcion: tarea.descripcion,
      },
      links: {
        list: "/api/tareas",
        create: "/api/tareas",
      },
    });
  } catch (error) {
    responderError(res, 400, "Error al eliminar la tarea");
  }
}

module.exports = {
  listarTareas,
  crearTarea,
  obtenerTarea,
  actualizarTarea,
  eliminarTarea,
};
