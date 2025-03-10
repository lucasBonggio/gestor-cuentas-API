# Gestor-Cuentas-API

![Node.js](https://img.shields.io/badge/Node.js-v16-blue) ![MySQL](https://img.shields.io/badge/MySQL-8.0-blue) ![License](https://img.shields.io/badge/License-MIT-yellow)

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
# 1. Clona el repositorio
git clone https://github.com/lucasBonggio/gestor-cuentas-API.git

# 2. Navega al directorio del proyecto
cd gestor-cuentas-API

# 3. Instala las dependencias
npm install

# 4. Configura las variables de entorno
cp .env.example .env  # O usa variables.env si prefieres ese nombre

# 5. Edita el archivo `.env` con tus credenciales
nano .env  # O usa cualquier editor de texto
```


## Contribuciones
Explica cómo otros pueden contribuir al proyecto:
```markdown
## Contribuciones

¡Las contribuciones son bienvenidas! Si deseas contribuir:

1. Abre un issue para discutir el cambio o mejora.
2. Haz un fork del repositorio y envía un pull request.
```


## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.



## Endpoints

### DELETE /usuario/:id
Elimina una cuenta asociada a la id proporcionada.

**Encabezados requeridos**:
- `Authorization: Bearer <token>`

**Parámetros de ruta**:
- `id` (int): La id de la cuenta que se quiere eliminar. 

**Respuesta exitosa (200 OK)**:
```json
{
  "message": "Cuenta eliminada exitosamente. "
}
```

Errores posibles: 

400 Bad Request: id inválida

```json
[
  {
    "message": "La ID debe ser un número entero positivo."
  }
]

```

404 Not Found: No se encontró la id

```json
[
  {
    "message": "No se encontró ninguna cuenta con el ID proporcionado."
  }
]
```

500 Internal Server Error: Error en el servidor

```json
[
  {
    "message": "Error del servidor. "
  }
]
```

### POST /register 
Acá es donde el usuario se registra

**Encabezados requeridos**
-`Authorization: Bearer <token>`

**Parámetros de ruta**
-`nombre_usuario` (string): Es el nombre de usuario registrado.
-`nombre` (string): El nombre real del usuario.
-`apellido` (string): El apellido del usuario. 
-`dia` (int): Dia de nacimiento.
-`mes` (string): Mes de nacimiento.
-`año` (int): Año de nacimiento.
-`genero` (string): Género del usuario.
-`email` (string): Email asociado a la cuenta del usuario.
-`contraseña` (string): Contraseña de la cuenta.


**Respuesta exitosa (200 OK)**

```json
[
  {
  "success": true,
  "message": "Usuario registrado exitosamente.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NDExNDc5MTQsImV4cCI6MTc0MTE1MTUxNH0.Zq8nP7FuNnZz6miWAtk5RjUC-iZALIaJquE1m1PLjG4",
  "user": {}
}
] 
```
Errores posibles: 

400 Bad Request: Algún campo falta
```json
[
  {
    "message": "Todos los campos son obligatorios. "
  }
]
```

400 Bad Request: Mes inválido
```json
[
  {
    "message": "Mes inválido. "
  }
]
```

500 Internal Server Error: Error al registrar el usuario
```json
[
  {
    "message": "Ocurrió un error inesperado al registrar el usuario. "
  }
]
```


### POST /login
Login principal

**Encabezados requeridos**:
-`Authorization: Bearer <token>`
-`Content-Type: application/json`

**Parámetros de ruta**:
-`gmail` (string): El gmail del usuario.
-`contraseña` (stromg): La contraseña del usuario.

**Respuesta exitosa (200 OK)**:
```json
{
  "message": "Inicio de sesión exitoso.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWNjZXNzIjp0cnVlLCJpZCI6Mywibm9tYnJlX3VzdWFyaW8iOiJjaGFybHMiLCJnbWFpbCI6ImdhcmNpYUBnbWFpbC5jb20iLCJyb2wiOiJ1c3VhcmlvIiwiaWF0IjoxNzQxMTUwMTMxLCJleHAiOjE3NDExNTM3MzF9.NGV9YN6etPXD-ueJcbAwsnsuaWaRTxYAIu_CS92syW8",
  "success": true,
  "user": {
    "id": 3,
    "nombre_usuario": "juanPerez",
    "gmail": "juan@gmail.com",
  }
}
```
Errores posibles:

400 Bad Request: Falta un parámetro.
```json
[
  {
    "message": "El correo electrónico y la contraseña son obligatorios. "
  }
]
```
401 Unauthorized: Error en la autenticación

```json
[
  {
    "message": "El correo electrónico no está registrado. " 
  }
]

[
  {
    "message": "Error interno. " 
  }
]

[
  {
    "message": "Credenciales inválidas. Verifica tu correo electrónico y contraseña. " 
  }
]
```

500 Internal Server Error: Error en el servidor

```json
[
  {
    "message": "Error del servidor. "
  }
]
```

### POST /generar-contrasena
Genera una contraseña

**Encabezados requeridos**
-`Content-Type: application/json`

**Parámetros de ruta**
-`longitud` (int): Es la longitud de la contraseña.
-`usarNumeros` (boolean): Son los caracteres que entran contraseña.
-`usarLetras` (boolean): Permite elegir si usar letras.
-`usarEspeciales` (boolean): Permite elegir si usar caracteres especiales.

**Respuesta exitosa (200 OK)**:
```json
[
  {
    "contraseña": "KNi)J>V;a334"
  }
]
```
Errores posibles:

400 Bad Request: Parámetros inválidos
```json
[
  {
    "message": "La longitud máxima es de 15 caracteres."
  }
]

[
  {
    "message": "Todos los parámetros son obligatorios. "
  }
]
```
500 Internal Server Error: 

```json
[
  {
    "message": "Ocurrió un error al generar la contraseña. "
  }
]
```

### POST /usuario/cuenta
Crea una cuenta. Esta cuenta es la que quiere guardar el usuario, no la del usuario principal.

**Encabezador requeridos**:
-`Authorization: Bearer <token>`
-`Content-Type: application/json`

**Parámetros de ruta**:
-`nombre_cuenta` (string): El nombre asignado a la cuenta.
-`nombre_servicio` (string): Es el nombre del servicio asignado a la cuenta(por ej. `Facebook`, `Reddit`).
-`contraseña` (string): Es la contraseña asignada a la cuenta.

**Respuesta exitosa (200 OK)**:
```json
[
  {
    "message": "Cuenta creada exitosamente."
  }
]

```

Errores posibles:

400 Bad Request: Error en los parámetros.

```json
[
  {
    "message": "Todos los datos son obligatorios. "
  }
]
```
```json
[
  {
    "message": "Error al crear cuenta en el modelo. "
  }
]
```

500 Internal Server Erorr: Error en el servidor

```json
[
  {
    "message": "Error del servidor. "
  }
]
```



### GET /perfil
Obtiene una lista de los datos que el usuario introdujo cuando creo su cuenta.

**Encabezados requeridos**:
-`Authorization: Bearer <token>`
-`Content-Tpye: application/json`

**Parámetros de ruta**:
-`Ninguno. `

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
```json
[
  {
    "message": "No se datos sobre el usuario. "
  }
]
```

500 Internal Server Error: Error interno del servidor
```json
[
  {
  "message": "Error al encontrar al usuario. "
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
```json
[
  {
    "message": "No se pudo encontró ninguna cuenta para este usuario. "
  }
]
```

500 Internal Server Error: Error interno del servidor
```json
[
  {
  "message": "Error al obtener cuentas. "
  }
]
```



### GET /usuario/servicio/:nombre_servicio
Obtiene una lista de usuarios asociados a un servicio específico.

**Encabezados requeridos**:
-`Ninguno.`

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
```json
[
  {
  "message": "No se encontró ninguna cuenta con el servicio proporcionado. "
  }
]
```

500 Internal Server Error: Error interno del servidor

```json
[
  {
  "message": "Error interno del servidor. "
  }
]
```


### GET /usuario/id/:id
Obtiene una lista de usuarios asociados a un id específico.

**Encabezados requeridos**:
-`Ninguno`.

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
```json
[
  {
  "message": "La ID debe ser un número entero positivo. "
  }
]
```

404 Not Found: Usuario no encontrado. 
```json
[
  {
    "message": "No se pudo encontrar la cuenta. "
  }
]
```

500 Internal Server Error: Error interno del servidor
```json
[
  {
  "message": "Error en el método encontrar por id. "
  }
]

```

### GET /usuario/nombre/:nombre_cuenta
Obtiene una lista de usuarios asociados a un nombre de cuenta específico.

**Encabezados requeridos**:
- `Ninguno`.

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
```json
[
  {
  "message": "El nombde de cuenta es obligatorio. "
  }
]
```

404 Not Found: Usuario no encontrado. 
```json
[
  {
    "message": "No se pudo encontró ninguna cuenta con el nombre proporcionado. "
  }
]
```

500 Internal Server Error: Error interno del servidor
```json
[
  {
  "message": "Error al encontrar el usuario. "
  }
]

```


