# Guía para Desarrolladores (Setup y Ejecución)

Bienvenido a la guía técnica de desarrollo para el Sistema de Gestión de Citas Médicas. Este documento explica paso a paso qué necesitas para levantar el proyecto localmente, los detalles técnicos de la base de datos y la justificación de las librerías empleadas.

## Requisitos Previos

Asegúrate de tener instalados en tu sistema local las siguientes herramientas:
- **Node.js** (v18 o superior)
- **NPM** (viene junto a Node)
- Servidor de **MySQL** (Puedes usar [XAMPP](https://www.apachefriends.org/es/index.html), MySQL Server, o Docker).

---

## 1. Configuración de la Base de Datos

El proyecto usa MySQL relacional. 

1. Abre tu gestor de base de datos preferido (phpMyAdmin desde XAMPP, DBeaver, MySQL Workbench).
2. Conéctate a tu servidor local de MySQL (usualmente `localhost`, puerto `3306`, usuario `root`, contraseña vacía o la que hayas configurado).
3. Entorno o Interfaz Gráfica: Ejecuta el script SQL estructurado ubicado en la raíz del proyecto.
   - Archivo: `database.sql`
   - Esto creará la base de datos `clinica_db` junto con la estructura de tablas para `medicos`, `pacientes` y `citas`.

---

## 2. Configuración de Entorno (Variables)

Tanto en el **Backend** como en el **Frontend** debes declarar tus variables de entorno para que las conexiones funcionen correctamente a tu entorno local.

### En el Backend (`/` carpeta raíz del proyecto backend)
Asegúrate de que exista un archivo `.env` en la raíz (junto a `package.json` y `app.ts`).
Su contenido debe ser:
```env
PORT=3000

# Credenciales para la Base de Datos MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=clinica_db
```
*Ajusta `DB_USER` y `DB_PASSWORD` si tu configuración local de XAMPP/MySQL es diferente.*

### En el Frontend (`/frontend`)
Si es necesario (depende de cómo expongas los endpoints al cliente frontend de Vite), crea de ser el caso un `.env` dentro de `/frontend`.
```env
VITE_API_URL=http://localhost:3000/api
```

---

## 3. Instalación de Dependencias

Se necesita instalar las librerías de `npm` para ambos espacios separados. En una terminal, ejecuta lo siguiente:

**Para el Backend (Directorio Raíz)**
```bash
npm install
```

**Para el Frontend (Directorio `/frontend`)**
```bash
cd frontend
npm install
```

---

## 4. Comandos de Ejecución

Debes levantar ambos servidores (Frontend y Backend) simultáneamente en consolas separadas.

### Iniciar el Backend
En la terminal (ubicada en la carpeta raíz del proyecto):
```bash
npm run dev
```
Levantará la API REST por defecto en `http://localhost:3000`. Usa `nodemon` por lo que tus cambios en el código se aplican automáticamente al guardar.

### Iniciar el Frontend
En otra terminal (ubicada en `/frontend`):
```bash
npm run dev
```
Levantará la app React por defecto usualmente en `http://localhost:5173`. Tu navegador se conectará automáticamente.

---

## 5. Librerías Utilizadas y su Propósito Analítico

A continuación, un glosario de las librerías Core utilizadas para que cualquier desarrollador entienda el contexto de la solución:

### Backend Libraries
- `express` (v5): Framework web ligero usado para crear el servidor y todos los endpoints de nuestra API REST (`/presentation/routes`).
- `mysql2 / promise`: Driver oficial moderno para MySQL. Permite consultas SQL asíncronas con uso de Promises (`async/await`) previniendo código de 'callbacks' anidados. Maneja también el *Connection Pool* de base de datos.
- `zod`: Herramienta de definición y validación de esquemas (Schema Validation). Permite que la capa de **Presentación** valide de forma segura peticiones (Ej. asegurar que la Fecha de una Cita venga en un formato de tiempo válido) protegiendo el `req.body`.
- `cors`: Middleware indispensable que permite al navegador desde el Frontend (es decir, en el puerto `:5173`) comunicarse sin ser bloqueado con el Backend (puerto `:3000`).
- `dotenv`: Toma valores del archivo `.env` y los inserta dentro de la variable global de nodo `process.env`. Indispensable para no embeber credenciales reales dentro del código TypeScript/Git.

### Frontend Libraries
- `react` & `react-dom`: Núcleo para componentes interactivos de UI basados en el manejo de estado.
- `react-router-dom`: Maneja las rutas en el navegador sin recargar la página (Single Page Application). Permite navegar entre la vista de "Medicos", "Pacientes" y el "Dashboard".
- `vite`: Herramienta de compilación ultrarrápida. Suplanta a Webpack/CRA, dando una de las mejores experiencias de desarrollo de front actual.
- `typescript` & `@types/*`: Tanto aquí como en Backend, asegura que el código cumpla un contrato estricto de autocompletado, evitando errores de tipo de datos (ej, confundir un `String` con un `Number`).

### Resumen Arquitectónico Clave para un Dev Nuevo
1. **La base de datos "hace el trabajo duro":** Mantenemos integridad desde la base de datos y tipado TypeScript asíncrono.
2. **Desacoplamiento Front/Back:** El backend no sabe que existe un frontend visual. Simplemente escupe JSON limpio.
3. El frontend no sabe nada de MySQL, únicamente se provee alimentándose a través del adaptador HTTP con Axios o Fetch consumiendo el backend.
