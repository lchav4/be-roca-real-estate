import { ObjectId } from "mongodb";
import { connectDB, db } from "../../database/db";
import bcrypt from "bcryptjs";
import fs from "fs/promises";

const saltRounds = 10;

export const getUser = async (email, password) => {
  await connectDB();
  const result = await db.collection("users").findOne({ email });

  if (result) {
    const isMatch = await verifyPassword(password, result.password_hash);
    if (!isMatch) {
      throw new Error("Contraseña incorrecta");
    }
    return {
      email: result.email,
      name: result.name,
      role: result.role,
      favorites: result.favorites,
    };
  } else {
    throw new Error("Usuario no encontrado");
  }
};

export const saveProperty = async (propertyData) => {
  await connectDB();
  const collection = db.collection("properties");

  if (
    !propertyData.title ||
    !propertyData.location ||
    !propertyData.propertyType
  ) {
    throw new Error("Faltan campos obligatorios");
  }

  const newProperty = {
    province: propertyData.province,
    region: propertyData.region,
    location: propertyData.location,
    propertyType: propertyData.propertyType,
    landSize: propertyData.landSize,
    title: propertyData.title,
    description: propertyData.description,
    salePrice: propertyData.forSale ? propertyData.salePrice : "",
    rentPrice: propertyData.forRent ? propertyData.rentPrice : "",
    createdAt: new Date(),
  };

  const propertyExists = await collection.findOne({ title: newProperty.title });

  if (propertyExists) {
    throw new Error("La propiedad ya existe");
  }

  await collection.insertOne(newProperty);

  const images = propertyData.images;
  let imagePaths = [];
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    const imageBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(imageBuffer);
    const imagePath = `public/uploads/${propertyData.title}_${i}.jpg`;
    await fs.writeFile(imagePath, buffer);
    imagePaths = [...imagePaths, imagePath];
  }
  return true;
};

export const findUser = async (email) => {
  await connectDB();
  const result = await db.collection("users").findOne({ email });

  if (result) {
    return true;
  } else {
    return false;
  }
};

export const createUser = async (email, name, password) => {
  await connectDB();
  const collection = db.collection("users");
  const existingUser = await collection.findOne({ email });
  if (existingUser) {
    throw new Error("El usuario ya existe");
  }

  const password_hash = await hashPassword(password);

  await db.collection("users").insertOne({
    email,
    name,
    password_hash,
    role: "CLIENT",
    favorites: [],
  });

  return true;
};

export const updatePassword = async (email, password) => {
  await connectDB();
  const password_hash = await hashPassword(password);
  await db
    .collection("users")
    .updateOne({ email }, { $set: { password_hash } });
  return true;
};

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

async function verifyPassword(password, hash) {
  const isMatch = await bcrypt.compare(password, hash);
  return isMatch;
}
