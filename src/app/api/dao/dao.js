import { ObjectId } from "mongodb";
import { connectDB, db } from "../../database/db";
import bcrypt from 'bcryptjs';

const saltRounds = 10;

export const getUser = async (email, password) => {
        await connectDB();
        const result = await db.collection('users').findOne({ email });

        if (result) {
            const isMatch = await verifyPassword(password, result.password_hash);
            if (!isMatch) {
                throw new Error('Contraseña incorrecta');
            }
            return {email: result.email, name: result.name, role: result.role, favorites: result.favorites};
        } else {
            throw new Error('Usuario no encontrado');
        }

}

export const createUser = async (email, name, password) => {
    await connectDB();
    const collection = db.collection('users');
    const existingUser = await collection.findOne({ email });
    if (existingUser) {
        throw new Error('El usuario ya existe');
    }

    const password_hash = await hashPassword(password);


    await db.collection('users').insertOne({
        email,
        name,
        password_hash,
        role: 'CLIENT',
        favorites: []
    });

    return true;
}

async function hashPassword(password) {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

async function verifyPassword(password, hash) {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
}