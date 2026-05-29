const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const Usuario = require("../models/usuario");

const clienteGoogle = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

function crearToken(usuario) {
  return jwt.sign(
    {
      id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
  );
}

async function loginGoogle(req, res) {
  try {
    const credential = req.body.credential;

    if (!credential) {
      return res.status(400).json({
        ok: false,
        mensaje: "No se envio el token de Google",
      });
    }

    const ticket = await clienteGoogle.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const googleId = payload.sub;
    const nombre = payload.name;
    const email = payload.email;
    const foto = payload.picture;

    let usuario = await Usuario.findOne({ googleId: googleId });

    if (!usuario) {
      usuario = new Usuario({
        googleId: googleId,
        nombre: nombre,
        email: email,
        foto: foto,
      });

      await usuario.save();
    }

    const token = crearToken(usuario);

    res.status(200).json({
      ok: true,
      mensaje: "Login con Google correcto",
      data: {
        token: token,
        usuario: {
          id: usuario._id,
          nombre: usuario.nombre,
          email: usuario.email,
          foto: usuario.foto,
        },
      },
    });
  } catch (error) {
    res.status(401).json({
      ok: false,
      mensaje: "Token de Google invalido",
    });
  }
}

module.exports = {
  loginGoogle,
};
