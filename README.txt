====================================================================
SISTEMA DE GESTION DE INVENTARIO - KIOSCO
====================================================================

Aplicacion Full Stack desarrollada con Node.js, Express, MySQL y React.

--------------------------------------------------------------------
1. REQUISITOS PREVIOS
--------------------------------------------------------------------
- Node.js (v18 o superior)
- Servidor MySQL (XAMPP, MySQL Workbench o servicio local en puerto 3306)

--------------------------------------------------------------------
2. CREACION DE LA BASE DE DATOS
--------------------------------------------------------------------
1. Iniciar el servicio de MySQL.
2. Ejecutar el script ubicado en `back/database/schema.sql` desde phpMyAdmin,
   MySQL Workbench o por consola:
   
   mysql -u root -p < back/database/schema.sql

   Esto creara la base de datos `kiosco_db` y las tablas `usuarios`,
   `categorias` y `productos`.

--------------------------------------------------------------------
3. VARIABLES DE ENTORNO
--------------------------------------------------------------------
A) Backend (`back/.env`):
Crear un archivo `.env` dentro de la carpeta `back/` con las siguientes variables:

PORT=3000
FRONTEND_URL=http://localhost:5173
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=kiosco_db
JWT_SECRET=clave_secreta_kiosco_2026

(Ajustar DB_USER y DB_PASSWORD segun la configuracion local de MySQL).

B) Frontend (`front/.env`):
Crear un archivo `.env` dentro de la carpeta `front/` con la siguiente variable:

VITE_API_URL=http://localhost:3000/api

--------------------------------------------------------------------
4. INSTALACION Y EJECUCION
--------------------------------------------------------------------
Se requieren dos terminales abiertas (una para el backend y otra para el frontend).

A) Terminal 1 - Backend:
   cd back
   npm install
   node database/seedUsers.js
   npm run dev

   El servidor quedara corriendo en: http://localhost:3000

B) Terminal 2 - Frontend:
   cd front
   npm install
   npm run dev

   La aplicacion web quedara disponible en: http://localhost:5173

--------------------------------------------------------------------
5. USUARIOS DE PRUEBA (Creados por seedUsers.js)
--------------------------------------------------------------------
- Administrador (acceso total a productos, stock y categorias):
  Usuario: admin
  Contrasena: 1234

- Empleado (visualizacion de inventario y ajuste de stock):
  Usuario: empleado
  Contrasena: 1234