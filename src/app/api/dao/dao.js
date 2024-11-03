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

export const updatePropertyByName = async (propertyName, updatedProperty) => {
  await connectDB();

  const existingProperty = await db.collection("properties").findOne({ title: propertyName });
  if (!existingProperty) {
    throw new Error("Propiedad no encontrada");
  }

  const updateData = {};
  if (updatedProperty.region) updateData.region = updatedProperty.region;
  if (updatedProperty.location) updateData.location = updatedProperty.location;
  if (updatedProperty.propertyType) updateData.propertyType = updatedProperty.propertyType;
  if (updatedProperty.landSize) updateData.landSize = updatedProperty.landSize;
  if (updatedProperty.description) updateData.description = updatedProperty.description;
  if (updatedProperty.forSale) updateData.salePrice = updatedProperty.forSale ? updatedProperty.salePrice : "";
  if (updatedProperty.forRent) updateData.rentPrice = updatedProperty.forRent ? updatedProperty.rentPrice : "";
  
  // Update the property using the provided fields
  const result = await db.collection("properties").updateOne(
    { title: propertyName },  // Query to find the property by title
    { $set: updateData }  // Fields to update
  );

  if (result.modifiedCount > 0) {
    return true;  // Successfully updated
  } else {
    throw new Error("No se pudo actualizar la propiedad. Es posible que no haya cambios.");
  }
};


export const updateProperty = async (propertyId, updatedFields) => {
  await connectDB();

  const collection = db.collection("properties");

  const updateData = {};
  for (const key in updatedFields) {
    if (updatedFields[key] !== undefined) {
      updateData[key] = updatedFields[key];
    }
  }

  const result = await collection.updateOne(
    { _id: new ObjectId(propertyId) }, 
    { $set: updateData }
  );

  if (result.modifiedCount === 0) {
    throw new Error("No se pudo actualizar la propiedad o no hay cambios.");
  }

  return true;
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
  };

  

  const propertyExists = await collection.findOne({ title: newProperty.title });

  if (propertyExists) {
    throw new Error("La propiedad ya existe");
  }

  await collection.insertOne(newProperty);
  const property = await collection.findOne({ title: newProperty.title });
  await collection.updateOne(
    { title: newProperty.title },
    { $set: { imagesURL: propertyData.images.map((_, index) => `uploads/${property._id.toString()}_${index}.jpg`) } }
  );

  const images = propertyData.images;
  let imagePaths = [];
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    const imageBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(imageBuffer);
    const imagePath = `public/uploads/${property._id.toString()}_${i}.jpg`;
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


export const getUserFavorites = async (email) => {
  const favoriteIds = await getFavorites(email);

  if (!favoriteIds || favoriteIds.length === 0) {
    return [];
  }

  const objectIds = favoriteIds.map(id => new ObjectId(id));

  try {
    const favoriteProperties = await db.collection("properties").find({
      _id: { $in: objectIds }
    }).toArray();

    return favoriteProperties;  
  } catch (error) {
    console.error("Error fetching user favorites:", error);
    return [];
  }
};

export const deleteUser = async (email) => {
  await connectDB();
  const result = await db.collection('users').deleteOne({ email });
  return result.deletedCount > 0; 
};

export const deleteProperty = async (propertyId, email) => {
  try {
    console.log("ITS WORKING IN DAO");
    const { db } = await connectDB();

    const user = await db.collection("users").findOne({ email });
    if (!user || user.role !== "ADMIN") {
      throw new Error("No tienes permisos para eliminar propiedades");
    }

    const property = await db.collection("properties").findOne({
      _id: new ObjectId(propertyId),
    });
    if (!property) {
      throw new Error("Propiedad no encontrada");
    }

    const result = await db.collection("properties").deleteOne({
      _id: new ObjectId(propertyId),
    });

    await db
      .collection("users")
      .updateMany(
        { favorites: propertyId },
        { $pull: { favorites: propertyId } }
      );

    if (result.deletedCount === 1) {
      return true;
    } else {
      throw new Error("No se pudo eliminar la propiedad");
    }
  } catch (error) {
    console.error("Error en deleteProperty:", error);
    throw error;
  }
};