# GeoSmart - Estructura Vanilla (Sin Frameworks)

Esta propuesta redefine el proyecto utilizando tecnologías web estándar. El objetivo es crear una Single Page Application (SPA) ligera donde el contenido cambia dinámicamente mediante JavaScript sin recargar la página.

## 1. Stack Tecnológico (100% Nativo)

*   **HTML5**: Uso de etiquetas semánticas para estructura y accesibilidad.
*   **CSS3 Moderno**: Grid y Flexbox para el layout; Variables CSS para el tema (colores, fuentes); Animaciones nativas con `@keyframes`.
*   **Vanilla JavaScript (ES6+)**:
    *   **Fetch API**: Para obtener los datos de los países de forma nativa.
    *   **Módulos de JS**: Para mantener el código organizado y evitar conflictos de variables.
    *   **Template Literals**: Para generar el HTML dinámico de las preguntas/respuestas.
*   **Almacenamiento**: `localStorage` para guardar récords y puntuaciones de forma local.

---

## 2. Estructura de Carpetas Simplificada

Al ser un proyecto Vanilla, la organización es clave para no perderse en el código:

```text
GeoSmart/
├── index.html              # El único archivo HTML (Punto de entrada)
├── css/
│   ├── main.css            # Estilos globales y reset
│   ├── components.css      # Estilos de botones, tarjetas y modales
│   └── animations.css      # Definición de efectos visuales
├── js/
│   ├── main.js             # Inicializador y controlador de rutas/vistas
│   ├── api.js              # Funciones para obtener países (fetch)
│   ├── state.js            # Objeto de estado global (puntuación, modo actual)
│   ├── ui.js               # Funciones para manipular el DOM (vistas)
│   ├── utils.js            # Funciones útiles (mezclar arrays, formatear números)
│   └── modes/              # Lógica específica de cada modo
│       ├── flags.js
│       ├── capitals.js
│       ├── population.js
│       └── currency.js
├── assets/                 # Imágenes, iconos y sonidos
└── README.md
