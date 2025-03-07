import mysql from 'mysql2/promise';
import { UserModel } from './ModelRegister.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import pool from './ModelRegister.js';

export class PassModel {
    //Registrar la cuenta del usuario
    static async registrarUsuario(nombre_usuario, gmail, contraseñaHasheada, genero, nombre, apellido, fecha_nacimiento) {

        // Consulta para verificar si el correo electrónico ya existe
        const checkQuery = 'SELECT id FROM usuarios WHERE gmail = ?';
        
        // Consulta para insertar un nuevo usuario
        const insertQuery = 'INSERT INTO usuarios(nombre_usuario, gmail, contraseña, genero, nombre, apellido, fecha_nacimiento) VALUES (?, ?, ?, ?, ?, ?, ?)';
    
        try {

            // Verificar si el correo electrónico ya está registrado
            const [existingUser] = await pool.execute(checkQuery, [gmail]);
            if (existingUser.length > 0) {
                return { success: false, message: 'El correo electrónico ya está registrado.' };
            }
    
            // Insertar el nuevo usuario
            const [insertResult] = await pool.execute(insertQuery, [nombre_usuario, gmail, contraseñaHasheada, genero, nombre, apellido, fecha_nacimiento]);
    
            // Verificar si la inserción fue exitosa
            if (insertResult.affectedRows === 0) {
                return { success: false, message: 'No se pudo crear el usuario.' };
            }
    
            console.log('Usuario creado exitosamente.');
            return {
                success: true,
                message: 'Usuario creado exitosamente.',
                userId: insertResult.insertId,
            };
        } catch (error) {
            
            console.error('Error al crear el usuario:', error.message);
    
            // Manejar errores si hay duplicados
            if (error.code === 'ER_DUP_ENTRY') {
                return { success: false, message: 'El nombre de usuario o correo electrónico ya está en uso.' };
            }
            return { success: false, message: 'Error inesperado al crear el usuario.', error: error.message };
        }
    };

    //Logear usuario
    static async logearUsuario(gmail, contraseñaIngresada) {

        try {
        
            // Buscar al usuario por correo electrónico
            const usuario = await UserModel.buscarEmail(gmail);
            if (!usuario) {
                return { success: false, message: 'El correo electrónico no está registrado.' };
            }
    
            // Verificar que el campo contraseña exista
            if (!usuario.contraseña) {
                return { success: false, message: 'Error interno: Contraseña hasheada no encontrada.' };
            }
    
            // Comparar contraseñas
            const comparar = await bcrypt.compare(contraseñaIngresada, usuario.contraseña);
            if (!comparar) {
                return { success: false, message: 'Credenciales inválidas. Verifica tu correo electrónico y contraseña.' };
            }
    
            // Generar un token JWT
            const token = jwt.sign(
                { 
                    success: true,
                    id: usuario.id, 
                    nombre_usuario: usuario.nombre_usuario, 
                    gmail: usuario.gmail
                },
                process.env.SECRET_JWT_KEY,
                { expiresIn: '1h' }
            );
    
            // Retornar el token y los datos del usuario
            return {
                success: true,
                message: 'Inicio de sesión exitoso.',
                token: token,
                user: {
                    id: usuario.id,
                    nombre_usuario: usuario.nombre_usuario,
                    gmail: usuario.gmail
                }
            };
        } catch (error) {

            console.error('Error al iniciar sesión:', error.message);
            return { success: false, message: 'Ocurrió un error inesperado al iniciar sesión.', error: error.message };
        }
    };

    // Encontrar cuenta usuario
    static async encontrarUsuario(nombre_usuario) {
        const queryBuscarUsuario = 'SELECT * FROM usuarios WHERE nombre_usuario = ?';
    
        try {

            const [rows] = await pool.execute(queryBuscarUsuario, [nombre_usuario]);
        
            // Verificar si se encontraron resultados
            if (rows.length === 0) {
                return { success: false, message: 'No se encontraron datos sobre el usuario.' };
            }
        
            console.log('Cuenta encontrada exitosamente.');
            return { success: true, data: rows }; 
        } catch (error) {

            console.error('No se pudo encontrar el usuario.');
            return { success: false, message: 'No se pudo encontrar al usuario.', error: error.message };
        }
    };

    static async crearCuenta(usuarioID, nombre_cuenta, contraseña, nombre_servicio) {

        // Validar si están todos los datos
        if (!nombre_cuenta) {
            return { success: false, message: 'El nombre de la cuenta es obligatorio.' };
        }
        if (!contraseña) {
            return { success: false, message: 'La contraseña es obligatoria.' };
        }
        if (!nombre_servicio) {
            return { success: false, message: 'El nombre del servicio es obligatorio.' };
        }
    
        const checkUserQuery = 'SELECT id FROM usuarios WHERE id = ?';
        const queryDetalles = 'INSERT INTO detallesCuentas(usuario_id, nombre_cuenta) VALUES (?, ?)';
        const queryServicios = 'INSERT INTO contrasenas(id_contrasena, nombre_servicio, contraseña) VALUES (?, ?, ?)';
    
        const connection = await pool.getConnection();
        
        // Iniciar transacción
        await connection.beginTransaction();     
        try {
            
            // Verificar si el usuario existe
            const [user] = await connection.execute(checkUserQuery, [usuarioID]);
            if (user.length === 0) {
                throw new Error('El usuario no existe.');
            }
    
            // Insertar en la tabla detallesCuentas
            const [resultUsuario] = await connection.execute(queryDetalles, [usuarioID, nombre_cuenta]);

            if (resultUsuario.affectedRows === 0) {
                throw new Error('No se pudo insertar en la tabla detallesCuentas.');
            }

            // Traemos el id de la cuenta creada
            const detallesCuentaID = resultUsuario.insertId; 
    
            // Insertar en la tabla contrasenas
            const [resultServicios] = await connection.execute(queryServicios, [detallesCuentaID, nombre_servicio, contraseña]);
            if (resultServicios.affectedRows === 0) {
                throw new Error('No se pudo insertar en la tabla contrasenas.');
            }
    
            // Confirmar transacción si todo sale bien
            await connection.commit(); 

            console.log('Cuenta guardada exitosamente.');
            return { success: true, message: 'Cuenta guardada exitosamente.' };
        } catch (error) {

            // Deshacer todos los cambios si algo falla
            await connection.rollback(); 
            console.error('Error al crear cuenta:', error.message);
            return { success: false, message: 'Ocurrió un error inesperado al guardar la cuenta.', error: error.message };
        } finally {
            
            connection.release(); // Liberar la conexión
        }
    }

    static async traerCuentas(usuarioID) {
        
        const queryCuentas = `
            SELECT d.id cuenta_id, d.nombre_cuenta, c.nombre_servicio, c.contraseña
            FROM detallesCuentas d
            JOIN contrasenas c ON d.id = c.id_contrasena
            WHERE d.usuario_id = ?
        `;
    
        try {
    
            const [rows] = await pool.execute(queryCuentas, [usuarioID]);
    
            // Verificar si se encontraron resultados
            if (rows.length === 0) {
                return { success: false, message: 'No se encontró ninguna cuenta para este usuario.' };
            }
    
            console.log('Cuentas encontradas exitosamente.');
            
            // Devuelve las cuentas encontradas
            return { success: true, data: rows }; 
        } catch (error) {

            console.error('Error al obtener las cuentas:', error.message);
            return { success: false, message: 'Error al obtener las cuentas.', error: error.message };
        }
    };
    // Eliminar cuentas guardadas
    static async eliminarCuenta(id) {

        try {
        
            // Convertir el ID a un número
            const parsedId = parseInt(id, 10);
    
            // Validar el ID
            validarId(parsedId);
    
            // Consulta para eliminar la cuenta
            const queryEliminar = 'DELETE FROM detallesCuentas WHERE id = ?';
    
            // Ejecutar la consulta
            const [rows] = await pool.execute(queryEliminar, [parsedId]);
            if (rows.affectedRows === 0) {
                return { success: false, message: 'No se encontró ninguna cuenta con el ID proporcionado.' };
            }
            // Devuelve el número de filas afectadas
            return {success: true, message: 'Cuenta eliminada exitosamente. ', data: rows.affectedRows };
        } catch (error) {
        
            console.error('Ocurrió un error al eliminar la cuenta:', error.message);
            return { success: false, message: 'Error al eliminar la cuenta.', error: error.message };
        }
    };

    //Encontrar por id
    static async encontrarPorId(id) {

        // Validar que el ID sea un número entero positivo
        if (!id || isNaN(id) || !Number.isInteger(Number(id)) || Number(id) <= 0) {
            return {success: false, message: 'La id es inválida. '}
        }
        
        const queryBuscarId = 'SELECT * FROM detallesCuentas d JOIN contrasenas ON d.id = id_contrasena WHERE d.id = ?';
        try {
    
            const [rows] = await pool.execute(queryBuscarId, [id]);
    
            // Verificar si se encontraron resultados
            if (rows.length === 0) {
                return { success: false, message: 'No se encontró ninguna cuenta con el ID proporcionado.' };
            }
    
            console.log('Cuenta encontrada exitosamente.');
            return { success: true, data: rows }; 
        } catch (error) {
            
            console.error('Error al buscar cuenta por ID:', error.message);
            return { success: false, message: 'Error al buscar cuenta por ID.', error: error.message };
        }
    }

    //Encontrar por nombre
    static async encontrarPorNombre(nombre_cuenta){

        if(!nombre_cuenta){
            return { success: false, message: 'El nombre de cuenta es obligatorio. '};
        }
        const queryBuscarNombre = 'SELECT * FROM detallesCuentas d JOIN contrasenas ON d.id = id_contrasena WHERE nombre_cuenta = ?';

        try {
            
            const [rows] = await pool.execute(queryBuscarNombre, [nombre_cuenta]);
            
            // Verificar si se encontraron resultados
            if (rows.length === 0) {
                return { success: false, message: 'No se encontró ninguna cuenta con el nombre proporcionado.' };
            }
    
            console.log('Cuenta encontrada exitosamente.'); 
            return { success: true, data: rows };
        } catch (error) {

            console.error('No se pudo encontrar el nombre de usuario. ');
            return {success: false, message: 'No se pudo encontrar al nombre de usuario. ', error: error.message};
        }
    };

    //Encontrar por servicio
    static async encontrarPorServicio(nombre_servicio){

        if(!nombre_servicio){
            return { success: false, message: 'El nombre del servicio es obligatorio. '};
        }

        const queryBuscarServicio = 'SELECT * FROM detallesCuentas d JOIN contrasenas ON d.id = id_contrasena WHERE nombre_servicio = ?';

        if(!nombre_servicio){
            return { success: false, message: 'El servicio es obligatorio. '};
        };
        
        try {
            const [rows] = await pool.execute(queryBuscarServicio, [nombre_servicio]);
            
            if (rows.length === 0) {
                return { success: false, message: 'No se encontró ninguna cuenta con el servicio proporcionado. ' };
            }
    
            console.log('Cuenta encontrada exitosamente.');
            return { success: true, data: rows }; // Devuelve los resultados encontrados
        } catch (error) {
            console.error('No se pudo encontrar el servicio. ', error.message);
            return {success: false, message: 'No se pudo encontrar el servicio. ', error: error.message};
        }
    };
}

