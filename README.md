# Gestor-Cuentas-API

![Node.js](https://img.shields.io/badge/Node.js-v16-blue) ![MongoDB](https://img.shields.io/badge/MongoDB-v5-green) ![License](https://img.shields.io/badge/License-MIT-yellow)

API RESTful para gestionar cuentas de usuario con operaciones CRUD y autenticación JWT.

---

## Tabla de Contenidos

1. [Descripción](#descripción)
2. [Características](#características)
3. [Requisitos](#requisitos)
4. [Instalación](#instalación)
5. [Uso](#uso)
6. [Endpoints](#endpoints)
7. [Contribuciones](#contribuciones)
8. [Licencia](#licencia)

---

## Descripción

Esta API permite administrar cuentas de usuario de manera eficiente, proporcionando endpoints seguros para crear, leer, actualizar y eliminar información de cuentas. Está diseñada para ser utilizada por desarrolladores que necesiten integrar un sistema de gestión de usuarios en sus aplicaciones.

Características principales:
- Autenticación segura mediante tokens JWT.
- Operaciones CRUD completas para gestionar cuentas.
- Validación de datos para garantizar la integridad de la información.
- Respuestas en formato JSON para facilitar la integración.

Construida con [Node.js](https://nodejs.org/) y [Express](https://expressjs.com/), esta API es ideal para proyectos que requieren una gestión centralizada de usuarios o clientes.

---

## Características

- **Autenticación JWT**: Protege las solicitudes con tokens de autenticación.
- **CRUD Completo**: Crea, lee, actualiza y elimina cuentas de usuario.
- **Validación de Datos**: Garantiza que toda la información ingresada cumpla con los requisitos mínimos.
- **Respuestas JSON**: Facilita la integración con frontend o aplicaciones móviles.

---

## Requisitos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

- [Node.js](https://nodejs.org/) v16+
- [MySQL](https://www.mysql.com/) 
- [Postman](https://www.postman.com/) (opcional, para probar endpoints)

---

## Instalación

Sigue estos pasos para configurar el proyecto localmente:

```bash
# Clona el repositorio
git clone https://github.com/lucasBonggio/gestor-cuentas-API.git

# Navega al directorio del proyecto
cd gestor-cuentas-API

# Instala las dependencias
npm install

# Configura las variables de entorno

# Inicia el servidor
npm start
```


## Endpoints

### GET /usuario/servicio/:nombre_servicio
Obtiene una lista de usuarios asociados a un servicio específico.

**Encabezados requeridos**:
- Ninguno.

**Parámetros de ruta**:
- `nombre_servicio` (string): El nombre del servicio a buscar (por ejemplo, `"Facebook"`, `"Github"`).

**Respuesta exitosa (200 OK)**:
```json
[
  {
    "id": 1,
    "usuario_id": "Juan Pérez",
    "nombre_cuenta": "juan@example.com",
    "id_contrasena": 45,
    "nombre_servicio": "Facebook",
    "contraseña": "9xvHIGcf6g"
  },
  {
    "id": 46,
    "usuario_id": 3,
    "nombre_cuenta": "Carlos Calvo",
    "id_contrasena": 46,
    "nombre_servicio": "Github",
    "contraseña": "T0ZvOnoS2"
  }
]
```

Errores posibles :

400 Bad Request: Si no se proporciona un nombre de servicio válido.
```
[
{
  "message": "No se encontró ninguna cuenta con el servicio proporcionado. "
}
]
```

404 Not Found: Si no se encuentran usuarios para el servicio especificado.


500 Internal Server Error: Error interno del servidor

```
[
{
  message: "Error interno del servidor. "
}
]

```
