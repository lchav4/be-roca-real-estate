import { MongoClient, Db } from 'mongodb';
import dns from 'node:dns';

let db: Db;

export const connectDB = async () => {
    dns.setDefaultResultOrder('ipv4first');
    const client = new MongoClient(process.env.MONGODB_URL as string);

    try {
        await client.connect();
        console.log('Conectado a la base de datos MongoDB');
        db = client.db(); // Obtener la instancia de la base de datos
    } catch (error) {
        console.error('Error de conexión a la base de datos:', error);
        process.exit(1);
    }
};
export { db };