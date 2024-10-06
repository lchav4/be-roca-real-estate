import { NextRequest, NextResponse } from 'next/server';
import  multer  from 'multer';
import path from 'path';
import { saveProperty } from '../dao/dao'; // Asegúrate de que la función saveProperty esté correctamente implementada

// Configuración de multer para almacenar imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/'); // Carpeta donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`); // Nombre único para cada archivo
  },
});

const upload = multer({ storage });

// Deshabilitar el análisis del cuerpo por defecto de Next.js
export const config = {
  api: {
    bodyParser: false,
  },
};

// Función para procesar la subida de archivos con multer
const uploadMiddleware = (req) => {
    return new Promise((resolve, reject) => {
      upload.array('images', 10)(req, null, (err) => {
        if (err) reject(err);
        resolve(req);
      });
    });
  };

  const readBody = (req) => {
    return new Promise((resolve, reject) => {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        resolve(body);
      });
      req.on('error', (err) => {
        reject(err);
      });
    });
  };

// Controlador POST para manejar la subida de imágenes y guardar la propiedad
export const POST = async (req) => {
  try {
    const body = await readBody(req);
    req.body = JSON.parse(body);

    // Procesar la subida de imagen
    await uploadMiddleware(req);

    const propertyData = req.body; // Obtener los datos de la propiedad
    const imagePaths = req.files ? req.files.map(file => file.path) : []; // Ruta de la imagen subida

    // Combinar la imagen con los datos de la propiedad
    const newProperty = {
      ...propertyData,
      images: imagePaths, // Guardar la ruta de la imagen
    };
    console.log(propertyData)

    // Guardar la propiedad en la base de datos
    await saveProperty(newProperty);

    return NextResponse.json(
      { message: 'Propiedad guardada con éxito' },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: `Error al guardar la propiedad: ${err.message}` },
      { status: 500 }
    );
  }
};
