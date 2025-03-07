import { PassController } from "../controllers/passControllers.js";
import express from "express";
import {validarToken} from "../utils/validarToken.js";

export const crearPassRouter = ({ passModel}) => {    

    const router = express.Router();

    router.post('/generar-contrasena', PassController.generarContraseña)
    router.post('/register', PassController.registroUsuario);
    router.post('/login', PassController.loginUsuario);
    router.post('/usuario/cuenta', validarToken, PassController.crearCuenta);

    router.delete('/usuario/:id', validarToken, PassController.eliminarCuenta);

    router.get('/perfil', validarToken, PassController.encontrarUsuario)
    router.get('/usuario/cuentas', validarToken, PassController.traerCuentas);
    router.get('/usuario/nombre/:nombre_cuenta', PassController.encontrarPorNombre);
    router.get('/usuario/id/:id', PassController.encontrarPorId);
    router.get('/usuario/servicio/:nombre_servicio', PassController.encontrarPorServicio);
    
    return router;
}
