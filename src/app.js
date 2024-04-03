const express = require("express");
const fs = require("fs");
const Jimp = require("jimp");
const { v4: uuidv4 } = require("uuid");
const app = express();
const PORT = 3000;

//Middlewares
app.use(express.static("public"));

//Rutas
app.get("/", (req, res) => {
  res.sendFile("index.html");
});

app.get("/imgRender", async (req, res) => {
  try {
    const { inputUrl } = req.query;
    res.setHeader("Content-Type", "image/png");

    const imagen = await Jimp.read(inputUrl);

    let nuevo_nombre_imagen = uuidv4().slice(0, 8) + "-nuevaImagen" + ".png";

    const ruta_imagen = `public/assets/img/${nuevo_nombre_imagen}`;

    await imagen
        .resize(350, Jimp.AUTO)
        .greyscale()
        .writeAsync(ruta_imagen);

    const imagenData = fs.readFileSync(ruta_imagen);

    res.send(imagenData);
  } catch (error) {
    console.error("Hubo un error", error.message);
    res.status(500).send(error.message);
  }
});

module.exports = { app, PORT };