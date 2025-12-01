# 💳 CreditSmart: Gestión y Simulación de Créditos

Este template proporciona una configuración mínima para hacer que React funcione en Vite.

---

## 👨‍💻 Información del Proyecto

### Nombre del Estudiante
Anderson Lopera Rodríguez

### Descripción del Proyecto
CreditSmart es una aplicación web dinámica construida con React que simula la gestión y presentación de productos crediticios. El objetivo principal es ofrecer a los usuarios una interfaz clara para explorar diferentes tipos de créditos (como "Crédito de libre inversión" y "Crédito de Vehículo"), ver sus detalles (tasas, montos, plazos) y utilizar una herramienta de simulación de préstamos.

---

## 🚀 Tecnologías Utilizadas

* **Frontend Framework:** React
* **Build Tool:** Vite
* **Routing:** React Router (Manejo de rutas como `/`, `/simulador`, `/solicitud`)
* **Estilos:** CSS3 / Estilos modulares (si se usa `App.css` para estilos globales)
* **Formato de Moneda:** API nativa de JavaScript (`Intl.NumberFormat`)

---

## 📦 Instalación y Ejecución

Sigue estos pasos para configurar y ejecutar el proyecto CreditSmart en tu entorno local.

### Prerrequisitos
Asegúrate de tener instalado [Node.js](https://nodejs.org/) (versión LTS recomendada) y npm.

### Pasos de Instalación

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/Ander-17/creditsmart.git
    cd creditsmart
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Ejecutar la aplicación en modo desarrollo:**
    ```bash
    npm run dev
    ```
    La aplicación se iniciará en `http://localhost:5173`.

---

## 📷 Pantallazos de la Aplicación

---

### Página Principal (Home)
![Captura de la página principal](public/images/Imagen5.png)

---

### Simulador de Crédito
![Captura de la página de simulador](public/images/Imagen4.png)

![Captura de búsqueda en la página de simulador](public/images/Imagen1.png)

---

### Formulario de Solicitud
![Captura de la página de solicitud](public/images/Imagen3.png)  

![Captura del alerta de envío de solicitud](public/images/Imagen2.png)

---

## 📚 Información Adicional de la Plantilla Vite

### Plugins Oficiales

Actualmente, dos *plugins* oficiales están disponibles:

-   [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) usa [Babel](https://babeljs.io/) (o [oxc](https://oxc.rs) cuando se usa en [rolldown-vite](https://vite.dev/guide/rolldown)) para *Fast Refresh*.
-   [@vitejs/plugin-react-swc](https://swc.rs/) usa [SWC](https://swc.rs/) para *Fast Refresh*.

### React Compiler

El *React Compiler* no está habilitado en esta plantilla debido a su impacto en el rendimiento de desarrollo y construcción (*dev* & *build*). Para agregarlo, consulta [esta documentación](https://react.dev/learn/react-compiler/installation).

### Expansión de la Configuración ESLint

Si estás desarrollando una aplicación de producción, recomendamos usar TypeScript con reglas de *lint* con reconocimiento de tipos habilitadas. Consulta la [plantilla TS](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) para obtener información sobre cómo integrar TypeScript y [`typescript-eslint`](https://typescript-eslint.io) en tu proyecto.
