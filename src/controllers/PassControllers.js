import { PassModel } from "../models/PassModels.js";
import generarContraseña from '../utils/generarContraseña.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';




export class PassController {

    static async registroUsuario(req, res) {
        try {
            const {nombre_usuario, nombre, apellido, dia, mes, año, genero, email, contraseña } = req.body;

            // Validar campos obligatorios
            if ( !nombre_usuario || !nombre || !apellido || !dia || !mes || !año || !genero || !email || !contraseña) {
                return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
            }

            // Convertir el mes a un número
            const meses = [
                'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
            ];
            const mesNumerico = meses.indexOf(mes) + 1;
            if (mesNumerico === 0) {
                return res.status(400).json({ message: 'Mes inválido.' });
            }

            // Validar que la fecha de nacimiento sea válida
            const fechaNacimiento = new Date(`${año}-${mesNumerico}-${dia}`);
            if (isNaN(fechaNacimiento.getTime())) {
                return res.status(400).json({ message: 'La fecha de nacimiento no es válida.' });
            }

            // Hashear la contraseña
            const contraseñaHasheada = await bcrypt.hash(contraseña, 10);

            // Registrar al usuario
            const cuenta = await PassModel.registrarUsuario(
                nombre_usuario,
                email,
                contraseñaHasheada,
                genero,
                nombre,
                apellido,
                fechaNacimiento
            );

            // Generar un token JWT
            const token = jwt.sign({
                    id: cuenta.id,
                    nombre_usuario: cuenta.nombre_usuario,
                    gmail: cuenta.gmail,
                    genero: cuenta.genero,
                    nombre: cuenta.nombre,
                    apellido: cuenta.apellido,
                },
                process.env.SECRET_JWT_KEY, 
                { expiresIn: '1h' }
            );

            // Respuesta al cliente
            return res.status(201).json({
                success: true,
                message: 'Usuario registrado exitosamente.',
                token: token,
                user: {
                    id: cuenta.id,
                    nombre_usuario: cuenta.nombre_usuario,
                    nombre: cuenta.nombre,
                    gmail: cuenta.gmail,
                    genero: cuenta.genero,
                    apellido: cuenta.apellido,
                },
            });
        } catch (error) {
            console.error('Error al registrar el usuario:', error.message);
            return res.status(500).json({
                message: 'Ocurrió un error inesperado al registrar el usuario. ',
                error: error.message,
            });
        }
    }

    static async loginUsuario(req, res) {
        try {
            const { gmail, contraseña } = req.body;
    
            // Validar campos obligatorios
            if (!gmail || !contraseña) {
                return res.status(400).json({ message: 'El correo electrónico y la contraseña son obligatorios.' });
            }
    
            // Iniciar sesión
            const resultado = await PassModel.logearUsuario(gmail, contraseña);
    
            // Verificar si hubo un error
            if (!resultado.success) {
                return res.status(401).json({ message: resultado.message });
            }
    
            // Respuesta al cliente
            return res.status(200).json({
                message: resultado.message,
                token: resultado.token,
                success: resultado.success,
                user: {
                    id: resultado.user.id,
                    nombre_usuario: resultado.user.nombre_usuario,
                    gmail: resultado.user.gmail,
                }
            });
        } catch (error) {
            console.error('Error al iniciar sesión:', error.message);
            return res.status(500).json({ message: 'Error del servidor.', error: error.message });
        }
    }

    static async cerrarSesion(req, res) {
        try {
            const token = req.headers.authorization?.split(' ')[1];
    
            if (!token) {
                return res.status(400).json({ message: 'No se proporcionó un token para revocar.' });
            }
    
            // Agregar el token a la lista negra
            await pool.execute('INSERT INTO blacklist (token) VALUES (?)', [token]);
    
            return res.status(200).json({ message: 'Sesión cerrada exitosamente.' });
        } catch (error) {
            console.error('Error al cerrar sesión:', error.message);
            return res.status(500).json({ message: 'Ocurrió un error al cerrar sesión.' });
        }
    }

    static async generarContraseña(req, res) {
        const max_longitud = 15;
        try {
            const {longitud, usarNumeros, usarLetras, usarEspeciales} = req.body;

            if (!longitud || !usarNumeros || !usarLetras|| !usarEspeciales) {
                return res.status(400).json({ message: 'Todos los parámetros son obligatorios.' });
            }

            if (isNaN(longitud) || longitud <= 0 || longitud > max_longitud) {
                return res.status(400).json({ message:  `La longitud máxima es ${max_longitud} caracteres.` });
            }
            const contraseña = generarContraseña(
                longitud,
                usarNumeros,
                usarLetras,
                usarEspeciales);

            res.json({ contraseña });
        } catch (error) {
            console.error('Error al generar la contraseña. ', error.message);
            return res.status(400).json({error: 'Ocurrió un error al generar la contraseña. '})
        }
    }
static async crearCuenta(req, res) {
    try {
        // Verificar si el usuario está autenticado
        if (!req.usuario || !req.usuario.id) {
            console.error('Usuario no autenticado.');
            return res.status(401).json({ message: 'Usuario no autenticado.' });
        }

        // Obtener la ID del usuario desde el token
        const usuarioID = req.usuario.id; 
        const { nombre_cuenta, nombre_servicio, contraseña } = req.body;

        // Validar campos obligatorios
        if (!nombre_cuenta || !nombre_servicio || !contraseña) {
            console.error('Campos obligatorios faltantes:', { nombre_cuenta, nombre_servicio, contraseña });
            return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
        }
        console.log('Datos recibidos:', req.body);
        
        // Llamar al modelo para crear la cuenta
        const resultado = await PassModel.crearCuenta(usuarioID, nombre_cuenta, contraseña, nombre_servicio);
        if (!resultado.success) {
            console.error('Error al crear cuenta en el modelo:', resultado.message);
            return res.status(400).json({ message: resultado.message });
        }

        console.log('Cuenta creada exitosamente.');
        return res.status(201).json({ message: 'Cuenta creada exitosamente.' });
    } catch (error) {
        console.error('Error en el servidor. ', error.message);
        return res.status(500).json({ message: 'Error del servidor.', error: error.message });
    }
}

    static async encontrarUsuario(req, res) {
        try {

            // Accede al nombre de usuario desde el token
            const nombre_usuario = req.usuario.nombre_usuario; 
    
            // Llamar al modelo para buscar el usuario
            const usuarioEncontrado = await PassModel.encontrarUsuario(nombre_usuario);
    
            // Verificar si se encontró algún usuario
            if (!usuarioEncontrado.success) {
                return res.status(404).json({ message: usuarioEncontrado.message });
            }
    
            // Extraer los datos del usuario
            const usuario = usuarioEncontrado.data[0];
    
            return res.status(200).json({
                message: 'Cuenta encontrada exitosamente.',
                usuario: {
                    id: usuario.id,
                    nombre_usuario: usuario.nombre_usuario,
                    gmail: usuario.gmail,
                    nombre: usuario.nombre || 'No disponible',
                    apellido: usuario.apellido || 'No disponible',
                    fecha_nacimiento: usuario.fecha_nacimiento || 'No disponible',
                    fecha_creacion: usuario.fecha_creacion || 'No disponible',
                    genero: usuario.genero || 'No disponible'
                }
            });
        } catch (error) {

            console.error('Error al encontrar al usuario:', error.message);
            return res.status(500).json({ message: 'Error del servidor', error: error.message });
        }
    }

    static async eliminarCuenta(req, res) {
        try {

            // Accede al ID desde los parámetros de la ruta
            const { id } = req.params; 
            const parsedId = parseInt(id, 10);

            if (!Number.isInteger(parsedId) || parsedId <= 0) {
                return res.status(400).json({ message: 'La ID debe ser un número entero positivo.' });
            }

            // Llamar al modelo para eliminar la cuenta
            const affectedRows = await PassModel.eliminarCuenta(parsedId);

            // Verificar si se eliminó alguna cuenta
            if (affectedRows === 0) {
                return res.status(404).json({ message: 'No se encontró ninguna cuenta con el ID proporcionado.' });
            }
            // Respuesta exitosa
            return res.status(200).json({ message: affectedRows.message });
        } catch (error) {

            console.error('Error al eliminar cuenta:', error.message);
            return res.status(500).json({ message: 'Error del servidor', error: error.message });
        }
    }

    static async traerCuentas(req, res) {
        try {
            // Obtener el ID del usuario autenticado
            const usuarioID = req.usuario.id;
    
            // Llamar al modelo para buscar las cuentas del usuario
            const resultado = await PassModel.traerCuentas(usuarioID);
    
            if (!resultado.success) {
                return res.status(404).json({ message: resultado.message });
            }
    
            return res.status(200).json({
                message: 'Cuentas encontradas exitosamente.',
                cuentas: resultado.data,
            });
        } catch (error) {
            console.error('Error al obtener las cuentas:', error.message);
            return res.status(500).json({ message: 'Error del servidor.', error: error.message });
        }
    }
    static async encontrarPorNombre(req, res) {
        try {
            const { nombre_cuenta } = req.params; // Accede al nombre de usuario desde los parámetros de la ruta
    
            // Validar que el nombre de usuario esté presente
            if (!nombre_cuenta) {
                return res.status(400).json({ message: 'El nombre de usuario es obligatorio.' });
            }
    
            // Llamar al modelo para buscar el usuario
            const usuarioEncontrado = await PassModel.encontrarPorNombre(nombre_cuenta);
            
            // Verificar si se encontró algún usuario
            if (!usuarioEncontrado.success) {
                return res.status(404).json({ message: usuarioEncontrado.message });
            }

            return res.status(200).json({
                message: 'Cuenta encontrada exitosamente.',
                usuario: usuarioEncontrado.data
            });
        } catch (error) {
            console.error('Error al encontrar al usuario:', error.message);
            return res.status(500).json({ message: 'Error del servidor', error: error.message });
        }
    }

    static async encontrarPorId(req, res) {
        try {    
            const { id } = req.params;
    
            if (!id) {
                return res.status(400).json({ message: 'La ID es obligatoria. '});
            }
    
            const parsedId = parseInt(id, 10);
    
            if (!Number.isInteger(parsedId) || parsedId <= 0) {
                console.log("ID inválido.");
                return res.status(400).json({ message: 'La ID debe ser un número entero positivo.' });
            }
    
            const usuarioEncontrado = await PassModel.encontrarPorId(parsedId);
    
            if (!usuarioEncontrado.success) {
                console.log("No se pudo encontrar la cuenta. ");
                return res.status(404).json({ message: usuarioEncontrado.message });
            }
    
            return res.status(200).json({
                message: 'Cuenta encontrada exitosamente.',
                usuario: usuarioEncontrado.data
            });
        } catch (error) {
            console.error("Error en el método encontrar por id:", error.message);
            return res.status(500).json({ message: 'Error del servidor', error: error.message });
        }
    }

    static async encontrarPorServicio(req, res) {
        try {
            const { nombre_servicio } = req.params;
            
            if (!nombre_servicio) {
                return res.status(400).json({ message: 'El servicio debe ser válido.' });
            }

            // Buscar la cuenta por servicio
            const resultado = await PassModel.encontrarPorServicio(nombre_servicio);

            // Verificar si se encontraron resultados
            if (!resultado.success) {
                return res.status(404).json({ message: resultado.message });
            }

            // Respuesta exitosa
            return res.status(200).json({
                message: 'Cuenta encontrada exitosamente.',
                usuario: resultado.data
            });
        } catch (error) {
            console.error("Error al buscar cuenta por servicio:", error.message);
            return res.status(500).json({ message: 'Error del servidor', error: error.message });
        }
    }
}