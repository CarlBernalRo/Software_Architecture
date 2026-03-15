# Sistema de Gestión de Citas Médicas

## Propósito del Proyecto
Este proyecto consiste en un sistema integral para la gestión de citas médicas de una clínica. Su objetivo principal es facilitar y optimizar los procesos de:
- Registro y administración de **Pacientes** y **Médicos**.
- Programación, cancelación y reprogramación de **Citas Médicas**.
- Consulta de disponibilidad de horarios de atención médica.

El sistema está diseñado para ser la columna vertebral digital de la clínica, mejorando la experiencia tanto del personal administrativo como de los usuarios a través de una plataforma moderna, escalable y mantenible.

## Arquitectura del Proyecto
Para asegurar la viabilidad a largo plazo, el proyecto implementa un patrón de **Arquitectura en Capas (Layered o Clean Architecture)** de forma simétrica en el cliente y en el servidor. Esto permite una separación clara de responsabilidades:

1. **Domain (Dominio):** Define las entidades centrales (Paciente, Médico, Cita) y las reglas de negocio base.
2. **Application (Aplicación):** Implementa los casos de uso que orquestan las acciones de los usuarios (ej. "AgendarCitaUseCase", "CompletarCitaUseCase"). Usa las interfaces de dominio para orquestar la información.
3. **Infrastructure (Infraestructura):** Maneja las implementaciones técnicas (conexión a bases de datos MySQL en el backend, clientes HTTP en el frontend, repositorios).
4. **Presentation (Presentación):** En el backend gestiona las rutas y controladores de API, y en el frontend aloja los componentes y vistas interactivos.

## Tecnologías Utilizadas

### Backend
- **Entorno y Framework:** Node.js y Express (v5)
- **Lenguaje:** TypeScript (Tipado estricto)
- **Base de Datos:** MySQL (mysql2) integrado de forma modular. Preparado para despliegue en XAMPP u otros motores.
- **Validación:** Zod, usado para validar esquemas y *payloads* en la capa de presentación.
- **Otras herramientas:** dotenv para variables de entorno y cors para políticas de dominios cruzados.

### Frontend
- **Librería UI:** React (v19)
- **Herramienta de Construcción:** Vite (rápido HMR y empaquetado optimizado)
- **Lenguaje:** TypeScript
- **Enrutamiento:** React Router DOM
- **Estándares de Código:** ESLint para control de calidad.

## Documentación Detallada

Para una inmersión más técnica sobre el funcionamiento de cada entorno, consulta la siguiente documentación:

- [Guía para Desarrolladores (Setup y Ejecución)](./developer-guide.md) - Instrucciones de instalación, conexión a BD y explicación de librerías.
- [Arquitectura del Backend](./backend.md)
- [Arquitectura del Frontend](./frontend.md)
- [ACA - Actividad de Construcción Aplicada](./ACA.md) - Documentación académica del proyecto (Normas APA).
- [Script de Base de Datos](../database.sql) - Contiene el DDL de las tablas SQL.
