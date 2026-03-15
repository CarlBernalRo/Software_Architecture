# Documentación del Backend

El backend se encarga de proveer una API REST para el Sistema de Gestión de Citas Médicas, centralizando la lógica de negocio y la conexión con la base de datos MySQL.

## 1. Arquitectura y Estructura (`/src`)

El backend sigue un estricto patrón de arquitectura limpia dividida en cuatro capas principales que interactúan entre sí bajo el principio de **Inversión de Dependencias (Dependency Inversion Principle)**.

- `/domain` (Dominio): Esta es la base de todo. No tiene conocimiento sobre bases de datos, librerías HTTP, API o frameworks. Aquí residen:
  - Los modelos TypeScript (ej. `Paciente`, `Medico`, `Cita`).
  - Las interfaces de los repositorios que indican *qué* operaciones se pueden hacer sobre ellos sin decir *cómo*.

- `/application` (Aplicación - Casos de Uso): Coordina los procesos puros del negocio (ej. "Agendar un cita", "Cancelar una cita", "Completar una cita", "Consultar disponibilidad"). Usa las interfaces definidas en la capa de `domain` para recuperar y guardar la información.

- `/infrastructure` (Infraestructura): Implementa las interfaces de los repositorios (definiendo el *cómo*).
  - Contiene los detalles técnicos (ej. `mysql2`).
  - `database/mysql.ts`: Maneja las conexiones *pool* a MySQL de forma asíncrona.

- `/presentation` (Presentación):
  - Recibe las llamadas HTTP externas mediante el framework Express.
  - Los **Controllers** se encargan de interpretar el cuerpo de la petición (`req.body`), validarlo (por ejemplo usando Zod) y llamar al caso de uso apropiado en `application`.
  - Construye la respuesta HTTP a enviar al cliente (`res.status().json()`).

## 2. Tecnologías Principales y Razones de Elección

- **Node.js + Express**: El estándar de la industria, proporciona un entorno rápido y un sistema robusto para crear endpoints fácilmente.
- **TypeScript**: Detecta errores de tiempo de compilación rápidamente. Al definir interfaces sobre respuestas u objetos esperados, el proceso de mantenimiento se vuelve predecible.
- **MySQL (vía `mysql2` + `Promise`)**: Ofrece soporte moderno asíncrono sobre MySQL nativo con parametrización incorporada que previene los ataques de Inyección SQL.
- **Zod**: Ideal en TypeScript; nos permite definir un Schema en la capa de presentación que se transforma en Tipos TypeScript y lanza errores claros con formato para el cliente en caso de que un payload no cumpla con los datos necesarios (ej. email inválido, número faltante).
- **Dotenv/CORS**: Oculta secretos (credenciales de BD, tokens privados) y asegura que las peticiones se acepten de los orígenes permitidos.

## 3. Guía de Ejecución

El punto de entrada del backend es `src/app.ts`.

- **Modo Desarrollo (`npm run dev`)**: Usa `nodemon` junto con `ts-node` o similar para recompilar el código al vuelo y reiniciar el servidor en caso de cambios en los ficheros locales.
- **Producción (`npm run build` && `npm run start`)**: El código TypeScript es analizado y compilado en la carpeta `dist/`. El comando start corre los archivos nativos JavaScript generados (en particular `dist/app.js`), brindando así el mayor rendimiento de NodeJS.
