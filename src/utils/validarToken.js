import jwt from 'jsonwebtoken';
import 'dotenv/config';

export const validarToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
    }

    const token = authHeader.split(' ')[1]; // Extrae el token después de "Bearer"
    try {
        const decoded = jwt.verify(token, process.env.SECRET_JWT_KEY); // Verifica el token
        req.usuario = decoded; // Asigna los datos del usuario a req.usuario
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Token inválido.', error: error.message });
    }
}