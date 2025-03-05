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

500 Internal Server Error: Error interno del servidor

```
[
  {
  message: "Error interno del servidor. "
  }
]

```

### GET /usuario/id/:id
Obtiene una lista de usuarios asociados a un id específico.

**Encabezados requeridos**:
- Ninguno.

**Parámetros de ruta**:
- `id` (int): El id de la cuenta a buscar (por ejemplo, `48`, `"6`).

**Respuesta exitosa (200 OK)**:
```json
[
  "message": "Cuenta encontrada exitosamente",
  "usuario": [
      {
        "id": 48,
        "usuario_id": "Julian Gimenez",
        "nombre_cuenta": "julian@example.com",
        "id_contrasena": 45,
        "nombre_servicio": "Facebook",
        "contraseña": "9xvHIGcf6g"
      }
  ]
]
```

Errores posibles :

400 Bad Request: Si no se proporciona un nombre de servicio válido.
```
[
  {
  "message": "La ID debe ser un número entero positivo. "
  }
]
```

404 Not Found: Usuario no encontrado. 
```
[
  {
    message: "No se pudo encontrar la cuenta. "
  }
]
```

500 Internal Server Error: Error interno del servidor
```
[
  {
  message: "Error en el método encontrar por id. "
  }
]

```

### GET /usuario/nombre/:nombre_cuenta
Obtiene una lista de usuarios asociados a un nombre de cuenta específico.

**Encabezados requeridos**:
- Ninguno.

**Parámetros de ruta**:
- `nombre_cuenta` (string): El nombre de la cuenta a buscar (por ejemplo, `"juanPerez"`, `"juan123"`).

**Respuesta exitosa (200 OK)**:
```json
{
  "message": "Cuenta encontrada exitosamente.",
  "usuario": [
    {
      "id": 46,
      "usuario_id": 3,
      "nombre_cuenta": "juanPerez",
      "id_contrasena": 46,
      "nombre_servicio": "Github",
      "contraseña": "T0ZvOnoS2"
    }
  ]
}
```

Errores posibles :

400 Bad Request: Si no se proporciona un nombre de servicio válido.
```
[
  {
  "message": "El nombde de cuenta es obligatorio. "
  }
]
```

404 Not Found: Usuario no encontrado. 
```
[
  {
    message: "No se pudo encontró ninguna cuenta con el nombre proporcionado. "
  }
]
```

500 Internal Server Error: Error interno del servidor
```
[
  {
  message: "Error al encontrar el usuario. "
  }
]

```


### GET /usuario/cuentas
Obtiene una lista de todas las cuentas.

**Encabezados requeridos**:
- `Authorization: Bearer <token>`

**Parámetros de ruta**:
- `Ninguno. `

**Respuesta exitosa (200 OK)**:
```json
{
  "message": "Cuentas encontrada exitosamente.",
  "cuentas": [
    {
      "cuenta_id": 45,
      "nombre_cuenta": "juanPerez",
      "nombre_servicio": "Github",
      "contraseña": "T0ZvOnoS2"
    },
        {
      "cuenta_id": 46,
      "nombre_cuenta": "carlosCalvo",
      "nombre_servicio": "Netflix",
      "contraseña": "T0ZvOnoS2"
    },
    {
      "cuenta_id": 47,
      "nombre_cuenta": "PepitoFlores",
      "nombre_servicio": "Facebook",
      "contraseña": "2lu6?<WF}"
    },
    {
      "cuenta_id": 48,
      "nombre_cuenta": "alaDelta123",
      "nombre_servicio": "Twitch",
      "contraseña": "jOkSj{g5+xz"
    }
  ]
}
```

Errores posibles :

404 Not Found: Cuentas no encontradas. 
```
[
  {
    message: "No se pudo encontró ninguna cuenta para este usuario. "
  }
]
```

500 Internal Server Error: Error interno del servidor
```
[
  {
  message: "Error al obtener cuentas. "
  }
]
```

### GET /perfil
Obtiene una lista de los datos que el usuario introdujo cuando creo su cuenta.

**Encabezados requeridos**:
- `Authorization: Bearer <token>`

**Parámetros de ruta**:
- `Ninguno. `

**Respuesta exitosa (200 OK)**:
```json
### GET /usuario/cuentas
Obtiene una lista de todas las cuentas.

**Encabezados requeridos**:
- `Authorization: Bearer <token>`

**Parámetros de ruta**:
- `Ninguno. `

**Respuesta exitosa (200 OK)**:
```json

{
  "message": "Cuenta encontrada exitosamente.",
  "usuario": {
    "id": 3,
    "nombre_usuario": "juanPerez",
    "gmail": "juan@gmail.com",
    "nombre": "Juan",
    "apellido": "Perez",
    "fecha_nacimiento": "2018-12-27T03:00:00.000Z",
    "fecha_creacion": "2025-03-04T04:05:04.000Z",
    "genero": "Masculino"
  }
}
```

Errores posibles :

404 Not Found: Cuentas no encontradas. 
```
[
  {
    message: "No se encontraron datos sobre el usuario. "
  }
]
```

500 Internal Server Error: Error interno del servidor
```
[
  {
  message: "Error al encontrar al usuario. "
  }
]
```
