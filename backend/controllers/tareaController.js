const Tarea = require("../models/tarea");
function crearLinksTarea(id) {
  return {
    self: `/api/tareas/${id}`,
    update: `/api/tareas/${id}`,
    delete: `/api/tareas/${id}`,
    archivos: `/api/tareas/${id}/archivos`,
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

/*
VERSION CHATGPT:
Esta version sube un archivo asociado a una tarea. Valida que la tarea
exista, verifica que se haya enviado un archivo, guarda la informacion
del archivo en MongoDB y devuelve una respuesta REST con metadata,
data y links.

async function subirArchivo(req, res) {
  try {
    const tarea = await Tarea.findById(req.params.id);

    if (!tarea) {
      return responderError(res, 404, "Tarea no encontrada");
    }

    if (!req.files || req.files.length === 0) {
      return responderError(res, 400, "No se envio ningun archivo");
    }

    const archivoSubido = req.files[0];

    const archivo = {
      nombreOriginal: archivoSubido.originalname,
      nombreGuardado: archivoSubido.filename,
      tipo: archivoSubido.mimetype,
      tamano: archivoSubido.size,
      ruta: archivoSubido.path,
    };

    tarea.archivos.push(archivo);

    await tarea.save();

    const archivoGuardado = tarea.archivos[tarea.archivos.length - 1];

    return res.status(201).json({
      ok: true,
      mensaje: "Archivo subido correctamente",
      metadata: crearMetadata(201),
      data: archivoGuardado,
      links: {
        tarea: `/api/tareas/${tarea._id}`,
        archivos: `/api/tareas/${tarea._id}/archivos`,
        download: `/api/tareas/${tarea._id}/archivos/${archivoGuardado._id}/download`,
      },
    });
  } catch (error) {
    return responderError(res, 500, "Error al subir archivo");
  }
}
*/

// Version adaptada
async function subirArchivo(req, res) {
  try {
    const tarea = await Tarea.findById(req.params.id);

    if (!tarea) {
      responderError(res, 404, "Tarea no encontrada");
      return;
    }

    if (!req.files || req.files.length === 0) {
      responderError(res, 400, "No se envio ningun archivo");
      return;
    }

    const archivoSubido = req.files[0];

    const archivo = {
      nombreOriginal: archivoSubido.originalname,
      nombreGuardado: archivoSubido.filename,
      tipo: archivoSubido.mimetype,
      tamano: archivoSubido.size,
      ruta: archivoSubido.path,
    };

    tarea.archivos.push(archivo);

    await tarea.save();

    res.status(201).json({
      ok: true,
      mensaje: "Archivo subido correctamente",
      metadata: {
        status: 201,
        timestamp: new Date().toISOString(),
      },
      data: tarea.archivos[tarea.archivos.length - 1],
      links: {
        tarea: "/api/tareas/" + tarea._id,
        archivos: "/api/tareas/" + tarea._id + "/archivos",
      },
    });
  } catch (error) {
    responderError(res, 500, "Error al subir archivo");
  }
}

/*
VERSION CHATGPT:
Esta version lista los archivos de una tarea especifica. Busca solo
el campo archivos para ahorrar datos y devuelve una lista con links
para descargar o eliminar cada archivo.

async function listarArchivos(req, res) {
  try {
    const tarea = await Tarea.findById(req.params.id).select("archivos");

    if (!tarea) {
      return responderError(res, 404, "Tarea no encontrada");
    }

    const archivos = tarea.archivos.map((archivo) => ({
      id: archivo._id,
      nombreOriginal: archivo.nombreOriginal,
      tipo: archivo.tipo,
      tamano: archivo.tamano,
      links: {
        download: `/api/tareas/${req.params.id}/archivos/${archivo._id}/download`,
        delete: `/api/tareas/${req.params.id}/archivos/${archivo._id}`,
      },
    }));

    return res.status(200).json({
      ok: true,
      mensaje: "Archivos de la tarea obtenidos correctamente",
      metadata: {
        status: 200,
        total: archivos.length,
        timestamp: new Date().toISOString(),
      },
      data: archivos,
    });
  } catch (error) {
    return responderError(res, 400, "Error al listar archivos");
  }
}
*/

// Version adaptada
async function listarArchivos(req, res) {
  try {
    const tarea = await Tarea.findById(req.params.id).select("archivos");

    if (!tarea) {
      responderError(res, 404, "Tarea no encontrada");
      return;
    }

    const archivos = tarea.archivos.map((archivo) => {
      return {
        id: archivo._id,
        nombreOriginal: archivo.nombreOriginal,
        tipo: archivo.tipo,
        tamano: archivo.tamano,
        links: {
          download:
            "/api/tareas/" +
            req.params.id +
            "/archivos/" +
            archivo._id +
            "/download",
          delete: "/api/tareas/" + req.params.id + "/archivos/" + archivo._id,
        },
      };
    });

    res.status(200).json({
      ok: true,
      mensaje: "Archivos de la tarea obtenidos",
      metadata: {
        status: 200,
        total: archivos.length,
        timestamp: new Date().toISOString(),
      },
      data: archivos,
    });
  } catch (error) {
    responderError(res, 400, "Error al listar archivos");
  }
}

/*
VERSION CHATGPT:
Esta version descarga un archivo asociado a una tarea. Primero valida
que exista la tarea, luego busca el archivo dentro del arreglo de
archivos y finalmente usa res.download() para enviarlo al navegador.

async function descargarArchivo(req, res) {
  try {
    const tarea = await Tarea.findById(req.params.id);

    if (!tarea) {
      return responderError(res, 404, "Tarea no encontrada");
    }

    const archivo = tarea.archivos.id(req.params.archivoId);

    if (!archivo) {
      return responderError(res, 404, "Archivo no encontrado");
    }

    return res.download(archivo.ruta, archivo.nombreOriginal);
  } catch (error) {
    return responderError(res, 400, "Error al descargar archivo");
  }
}
*/

// Version adaptada
async function descargarArchivo(req, res) {
  try {
    const tarea = await Tarea.findById(req.params.id);

    if (!tarea) {
      responderError(res, 404, "Tarea no encontrada");
      return;
    }

    const archivo = tarea.archivos.id(req.params.archivoId);

    if (!archivo) {
      responderError(res, 404, "Archivo no encontrado");
      return;
    }

    res.download(archivo.ruta, archivo.nombreOriginal);
  } catch (error) {
    responderError(res, 400, "Error al descargar archivo");
  }
}

/*
VERSION CHATGPT:
Esta version elimina un archivo de una tarea. Primero valida que exista
la tarea y el archivo. Luego elimina el archivo fisico de la carpeta
uploads usando fs, elimina la metadata del archivo en MongoDB y guarda
los cambios en la tarea.

async function eliminarArchivo(req, res) {
  try {
    const fs = require("fs");

    const tarea = await Tarea.findById(req.params.id);

    if (!tarea) {
      return responderError(res, 404, "Tarea no encontrada");
    }

    const archivo = tarea.archivos.id(req.params.archivoId);

    if (!archivo) {
      return responderError(res, 404, "Archivo no encontrado");
    }

    if (fs.existsSync(archivo.ruta)) {
      fs.unlinkSync(archivo.ruta);
    }

    tarea.archivos.pull(req.params.archivoId);

    await tarea.save();

    return res.status(200).json({
      ok: true,
      mensaje: "Archivo eliminado correctamente",
      metadata: crearMetadata(200),
      links: {
        tarea: `/api/tareas/${tarea._id}`,
        archivos: `/api/tareas/${tarea._id}/archivos`,
      },
    });
  } catch (error) {
    return responderError(res, 400, "Error al eliminar archivo");
  }
}
*/

// Version adaptada
async function eliminarArchivo(req, res) {
  try {
    const fs = require("fs");

    const tarea = await Tarea.findById(req.params.id);

    if (!tarea) {
      responderError(res, 404, "Tarea no encontrada");
      return;
    }

    const archivo = tarea.archivos.id(req.params.archivoId);

    if (!archivo) {
      responderError(res, 404, "Archivo no encontrado");
      return;
    }

    if (fs.existsSync(archivo.ruta)) {
      fs.unlinkSync(archivo.ruta);
    }

    tarea.archivos.pull(req.params.archivoId);

    await tarea.save();

    res.status(200).json({
      ok: true,
      mensaje: "Archivo eliminado correctamente",
      metadata: {
        status: 200,
        timestamp: new Date().toISOString(),
      },
      links: {
        tarea: "/api/tareas/" + tarea._id,
        archivos: "/api/tareas/" + tarea._id + "/archivos",
      },
    });
  } catch (error) {
    responderError(res, 400, "Error al eliminar archivo");
  }
}

module.exports = {
  listarTareas,
  crearTarea,
  obtenerTarea,
  actualizarTarea,
  eliminarTarea,
  subirArchivo,
  listarArchivos,
  descargarArchivo,
  eliminarArchivo,
};
