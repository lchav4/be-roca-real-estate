import { ObjectId } from "mongodb";
import { connectDB, db } from "../../database/db";
import bcrypt from "bcryptjs";
import fs from "fs/promises";
import { title } from "process";

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
    region: propertyData.region,
    location: propertyData.location,
    propertyType: propertyData.propertyType,
    landSize: propertyData.landSize,
    title: propertyData.title,
    description: propertyData.description,
    salePrice: propertyData.forSale === 'true' ? propertyData.salePrice : "",
    rentPrice: propertyData.forRent === 'true' ? propertyData.rentPrice : "",
    createdAt: new Date(),
    imagesURL: propertyData.images.map((image, index) => `uploads/${propertyData.title}_${index}.jpg`),
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

export const getProperties = async (filters) => {
  await connectDB();
  const properties = await db.collection("properties").find().toArray();

  const filteredProperties = properties.filter(
    (property) =>
      (filters.propertyType === "Todos" ||
        property.propertyType === filters.propertyType) &&
      (filters.region === "Todos" || property.region === filters.region) &&
      property.landSize >= filters.minSize &&
      property.landSize <= filters.maxSize &&
      ((property.salePrice >= filters.minPrice &&
        property.salePrice <= filters.maxPrice) ||
        (property.rentPrice >= filters.minPrice &&
          property.rentPrice <= filters.maxPrice)) &&
      (filters.purpose === "Ambos" ||
        (filters.purpose === "Comprar" && property.salePrice) ||
        (filters.purpose === "Alquilar" && property.rentPrice))
  );

  return filteredProperties;
};

export const updateProfile = async (currentEmail, updatedFields) => {
  try {
    await connectDB();

   
    if (updatedFields.email) {
      const emailExists = await db.collection("users").findOne({ email: updatedFields.email });
      if (emailExists) {
        throw new Error("El nuevo correo electrónico ya está en uso.");
      }
    }

    const result = await db.collection("users").updateOne(
      { email: currentEmail },  
      { $set: updatedFields }  
    );

    if (result.modifiedCount > 0) {
      return true;  
    } else {
      throw new Error("No se pudo actualizar el perfil. Es posible que no haya cambios.");
    }
  } catch (error) {
    throw new Error("Error al actualizar el perfil: " + error.message);
  }
};

export const addFavorite = async (email, propertyId, isAdding) => {
  await connectDB();
  const user = await db.collection("users").findOne({ email });

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  const property = await db.collection("properties").findOne({ title: propertyId });

  const propertyObjectId = property._id.toString();

  if (isAdding) {
    await db.collection("users").updateOne(
      { email },
      { $addToSet: { favorites: propertyObjectId } }
    );
  } else {
    await db.collection("users").updateOne(
      { email },
      { $pull: { favorites: propertyObjectId } }
    );
  }

  return true;
}

export const getFavorites = async (email) => {
  await connectDB();
  const user = await db.collection("users").findOne({ email });
  const favorites = user.favorites;
  return favorites;
}
