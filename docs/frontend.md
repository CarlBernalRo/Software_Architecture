# Documentación del Frontend

El frontend actúa como la interfaz interactiva para el usuario final del sistema de gestión de citas médicas y el personal de la clínica.

## 1. Patrón Arquitectónico (`/frontend/src`)

En consonancia con el backend, el proyecto implementa la misma jerarquía de capas lógicas utilizando React, pero adaptado a la web.

- `/domain`: Modelos o interfaces de TypeScript que coinciden o están mapeadas según las respuestas de la API del Backend. Define el "contrato de datos".
- `/application`:
  - Contiene *Hooks* personalizados (`useCitas`, `usePacientes`, etc.) o clases de servicios de aplicación.
  - Su propósito fundamental es desacoplar React del "cómo" o el "dónde" se busca la información. Permite reutilizar reglas de obtención y retención de estado a lo largo de diversos componentes.
- `/infrastructure`: Adaptadores HTTP y repositorios de datos frontales. Por lo general, engloban las llamadas `fetch()` y parseo de las respuestas provenientes desde la API REST. Se ajustan a las interfaces del dominio para garantizar consistencia.
- `/presentation`:
  - Enrutamiento provisto por React Router DOM (Manejo de rutas amigables en cliente).
  - Los **Componentes UI de React**. Solo llaman a los métodos de la capa `application` y reaccionan cediendo visualizaciones de estados a los usuarios (Carga, Errores, Vista exitosa de un panel).
- `/assets`: Recursos gráficos (imágenes, iconos vectoriales y otros insumos estáticos).

## 2. Decisiones Tecnológicas

- **React (v19)**: Ofrece renderizado declarativo basado en la reactividad del estado, modularizando grandes piezas visuales de la clínica en componentes desacoplados reutilizables e independientes.
- **Vite**: El empaquetador web base de nueva generación. Inicia un servidor de desarrollo en milisegundos gracias al ECMAScript Modules (ESM) nativo y el Hot Module Replacement (HMR).
- **TypeScript**: Actúa previniendo propiedades indefinidas (por ejemplo, si en la API cambia un campo llamado "duracion_minutos" por "duracion", TypeScript alertará visualmente en todos los componentes si no coinciden los contratos).
- **ESLint**: Garantiza una consistencia estilística en el código final mediante el escaneo previo de buenas prácticas antes del commit de cambios.

## 3. Guía de Desarrollo

- **Modo Desarrollo (`npm run dev`)**: Instancia Vite en los puertos locales. Los cambios en los componentes React son observados de manera inmediata simulando la carga en navegador.
- **Flujo de Trabajo para Producción (`npm run build`)**: Vite minificará todos los HTML, CSS y JS compilados desde React/TS en una sola carpeta `dist/` con su caché y assets unificados, listos para integrarlos y servirlos desde NGINX, Apache, Vercel u otros.
