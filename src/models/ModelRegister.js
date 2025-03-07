import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';
import 'dotenv/config';

// Crear un pool de conexiones
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

console.log('Pool de conexiones configurado.');

export default pool;


export class UserModel{
    
    static async buscarEmail(gmail){
        
        const queryEmail = "SELECT * FROM usuarios WHERE gmail = ?";
        try {
            const [filas] = await pool.execute(queryEmail, [gmail]);
            return filas[0] || null;
        } catch (error) {
            console.error('Error al encontrar al usuario. ', error.message);
            throw error;
        }
    }

    static async compararContraseña(contraseñaIngresada, contraseñaHasheada){
        try {
            return await bcrypt.compare(contraseñaIngresada, contraseñaHasheada);
        } catch (error) {
            console.error('Error al comparar contraseñas. ', error.message);
            throw error;
        }
    }
}