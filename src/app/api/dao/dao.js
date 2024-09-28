import { ObjectId } from "mongodb";
import { connectDB, db } from "../../database/db";

export const getUser = async (email) => {
    try {
        await connectDB();
        const result = await db.collection('users').findOne({ email });

        if (result) {
            return result;
        } else {
            return '';
        }
    } catch (err) {
        console.error('Error al cargar datos desde la base de datos:', err);
        return '';
    }
}

export const createUser = async (email, name, password) => {
    await connectDB();
    const collection = db.collection('users');
    const existingUser = await collection.findOne({ email });
    if (existingUser) {
        throw new Error('El usuario ya existe');
    }

    await db.collection('users').insertOne({
        email,
        name,
        password_hash: password,
        role: 'CLIENT',
        favorites: []
    });

    return true;
}
