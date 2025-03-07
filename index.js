import express from "express";
import cors from 'cors';
import pool from "./src/models/ModelRegister.js";
import { createApp } from "./src/config/App.js";
import dotenv from 'dotenv';


dotenv.config({path: './src/utils/variables.env'})

const app = express();

app.use(cors());
app.use(cors({origin: `http://localhost:${process.env.SERVER_PORT}`}));

(async ()=> {
    try {

        const passModel = {};
        createApp({passModel});

        process.on('SIGINT', async () => {
            await pool.end();
            console.log('Conexión a la base de datos cerrada.');
            process.exit(0);
        });
    }catch (error) {
        console.error('Error al iniciar la aplicación: ', error.message);
        process.exit(1);
    }
})();
