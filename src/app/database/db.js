import { MongoClient, Db } from 'mongodb';

let db;

export const connectDB = async () => {
    const client = new MongoClient(process.env.MONGODB_URL);

    try {
        await client.connect();
        console.log('Conectado a la base de datos MongoDB');
        db = client.db();
    } catch (error) {
        console.error('Error de conexión a la base de datos:', error);
        process.exit(1);
    }
};
export { db };