import { MongoClient } from 'mongodb';

let db;
let client;

export const connectDB = async () => {
    if (!db) { 
        client = new MongoClient(process.env.MONGODB_URL);

        try {
            await client.connect();
            console.log('Conectado a la base de datos MongoDB');
            db = client.db(); 
        } catch (error) {
            console.error('Error de conexión a la base de datos:', error);
            process.exit(1); 
        }
    }
    return { db, client }; 
};

export { db };
