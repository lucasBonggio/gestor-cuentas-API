import express from 'express';
import { crearPassRouter } from '../routes/PassRoutes.js';
import 'dotenv/config';
import cors from 'cors';


export const createApp = ({ passModel }) => {
    const app = express();

    app.use(cors());
    app.use(express.json());
    console.log('Middleware configurado. ');
    app.use('/api/auth', crearPassRouter(passModel));
    console.log('Rutas configuradas. ')
    
    const PORT = process.env.SERVER_PORT || 1234;

    app.listen(PORT, () => {
        console.log(`Server configurado. http://localhost:${PORT}`);
    })
}