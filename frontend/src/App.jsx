import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [tareas, setTareas] = useState([]);
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState("");
  const [mensaje, setMensaje] = useState("");

  const url = "http://localhost:3000/api/tareas";

  useEffect(() => {
    listarTareas();
  }, []);

  async function listarTareas() {
    try {
      const respuesta = await fetch(url);
      const datos = await respuesta.json();

      setTareas(datos.data);
      setMensaje(datos.mensaje);
    } catch (error) {
      setMensaje("Error al cargar");
    }
  }

  async function agregarTarea(e) {
    e.preventDefault();

    if (descripcion === "" || fecha === "") {
      setMensaje("Faltan datos");
      return;
    }

    const respuesta = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        descripcion: descripcion,
        fecha: fecha,
      }),
    });

    const datos = await respuesta.json();

    setMensaje(datos.mensaje);
    setDescripcion("");
    setFecha("");

    listarTareas();
  }

  async function cambiarEstado(id, completada) {
    await fetch(url + "/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        completada: !completada,
      }),
    });

    listarTareas();
  }

  async function eliminarTarea(id) {
    await fetch(url + "/" + id, {
      method: "DELETE",
    });

    setMensaje("Tarea eliminada");
    listarTareas();
  }

  return (
    <div>
      <h1>Todo List</h1>

      <form onSubmit={agregarTarea}>
        <p>Descripcion</p>
        <input
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />

        <p>Fecha</p>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />

        <br />
        <button>Agregar</button>
      </form>

      <p>{mensaje}</p>

      <button onClick={listarTareas}>Listar tareas</button>

      <hr />

      <ul>
        {tareas.map((tarea) => (
          <li key={tarea.id}>
            <p>{tarea.descripcion}</p>
            <p>{tarea.fecha.substring(0, 10)}</p>
            <p>{tarea.completada ? "Completada" : "Pendiente"}</p>

            <button onClick={() => cambiarEstado(tarea.id, tarea.completada)}>
              {tarea.completada ? "Pendiente" : "Completar"}
            </button>

            <button onClick={() => eliminarTarea(tarea.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
