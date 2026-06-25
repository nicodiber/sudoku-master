# 🧩 Sudoku Master Web

Un juego de Sudoku interactivo y dinámico desarrollado íntegramente con **HTML5, CSS3 y JavaScript Vanilla**. Este proyecto fue creado como trabajo académico demostrando la aplicación de patrones de diseño, manipulación del DOM, algoritmos de matrices y almacenamiento local en el navegador.

🌐 <a href="https://nicodiber.github.io/sudoku-master/" target="_blank">INICIAR EL PROYECTO</a>

---

## 📖 Descripción del Proyecto

Sudoku Master Web no es solo un tablero estático, sino una aplicación completa (estilo *Single Page Application*). El sistema genera tableros jugables de forma dinámica a partir de un tablero base utilizando transformaciones matemáticas (intercambio de bandas horizontales y verticales), garantizando combinaciones únicas sin depender de bases de datos externas o APIs.

## ✨ Características Principales

- 🎮 **Tres Niveles de Dificultad:** Fácil, Medio y Difícil. Cada nivel ajusta la cantidad de pistas iniciales, el puntaje base y cambia dinámicamente el tema de color de la interfaz.
- 📝 **Modo Lápiz (Notas):** Permite a los jugadores anotar posibles números en una celda (en una sub-cuadrícula 3x3).
- 🧹 **Limpieza Inteligente:** Al colocar un número correcto en el tablero, el sistema automáticamente borra ese número de las "notas" de las celdas adyacentes (misma fila, columna y bloque 3x3).
- ⏪ **Sistema Deshacer:** Implementación de historial permitiendo retroceder acciones del jugador.
- ⌨️ **Soporte Completo de Teclado:** Navegación fluida por el tablero usando las flechas direccionales y atajos rápidos.
- 🏆 **Ranking Persistente:** Sistema de puntuación (basado en tiempo y penalizaciones por error) guardado localmente en el navegador mediante `localStorage`.
- ❤️ **Sistema de Vidas:** 5 vidas por partida. Cada error resta una vida y aplica una penalización severa de +300 puntos (en este ranking, menos puntos/tiempo es mejor).

---

## 🛠️ Tecnologías Utilizadas

- **HTML5:** Estructura semántica.
- **CSS3:** Diseño responsivo utilizando **Flexbox** (para el tablero de 9x9 proporcional) y variables de estado para cambios de tema.
- **JavaScript (Vanilla):** Lógica del negocio y control del juego sin el uso de librerías ni frameworks externos. 

---

## 📂 Arquitectura y Estructura del Código

El código está modularizado para respetar el principio **SoC (Separación de Responsabilidades)**, facilitando su mantenimiento y escalabilidad:

- 📄 `state.js`: Almacena el estado global de la partida (`gameState`) y las matrices de datos (`gameData`).
- 📄 `generator.js`: Contiene la lógica matemática. Se encarga de mezclar el tablero base válido y aplicar las máscaras (ocultamiento de números) según la dificultad.
- 📄 `game.js`: El motor del juego. Controla las validaciones, el temporizador, el sistema de vidas, el manejo de notas y la función de deshacer.
- 📄 `ui.js`: Capa de presentación. Se encarga exclusivamente de sincronizar los datos de JS con el DOM visual (renderizado, control de modales, actualización de UI).
- 📄 `storage.js`: Capa de persistencia. Maneja la lectura y escritura del ranking histórico usando `localStorage`.
- 📄 `main.js`: El controlador principal. Captura los eventos del usuario (clics, teclado, formularios) y los delega a las funciones correspondientes.

---

## 🚀 Instalación y Ejecución

Al estar desarrollado puramente en tecnologías web cliente (Frontend), no requiere la instalación de dependencias ni bases de datos.

1. Clona este repositorio en tu máquina local:
   ```bash
   git clone [https://github.com/nicodiber/sudoku-master.git](https://github.com/nicodiber/sudoku-master.git)

2. Abre la carpeta del proyecto.

3. Haz doble click en el archivo index.html para abrirlo en tu navegador web de preferencia.

## 🎮 Controles y Atajos de Teclado

Para una mejor experiencia (UX), puedes jugar utilizando el mouse o directamente el teclado de tu computadora:

- Flechas Direccionales (↑, ↓, ←, →): Moverse entre las celdas del tablero.

- Números del 1 al 9: Ingresar un número en la celda seleccionada.

- N: Activar / Desactivar el Modo Lápiz (Notas).

- Retroceso (Backspace) o Suprimir (Delete): Usar la goma de borrar en la celda actual.

- Ctrl + Z: Deshacer la última acción.

## 👨‍💻 Autor

- Nicolás Di Bernardo - Análisis y desarrollo del proyecto.

- GitHub: @nicodiber