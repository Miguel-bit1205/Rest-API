require("dotenv").config();

const dns = require("dns");
const express = require("express");
const mongoose = require("mongoose");
const tareasRouter = require("./routes/tareas");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app = express();
const puerto = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/tareas", tareasRouter);

async function conectarMongoDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Conexion exitosa con MongoDB Atlas");
  } catch (error) {
    console.log("Error al conectar MongoDB");
    console.log(error);
  }
}

conectarMongoDB();

app.get("/", (req, res) => {
  res.json({
    mensaje: "API REST Todo List funcionando",
  });
});

app.listen(puerto, () => {
  console.log(`Servidor iniciado en http://localhost:${puerto}`);
});
