import { state } from './state.js';
import { initFlagsGame, handleAnswer, generateQuestion } from './modes/flags.js';

const app = document.getElementById('app');

/**
 * Renderiza el menú principal de selección de juegos
 */
export const renderMenu = () => {
    // Asegurar que la barra de estadísticas esté oculta en el menú
    document.getElementById('stats-bar')?.classList.add('hidden');
    
    app.innerHTML = `
        <div class="menu-container fade-in">
            <h2 class="menu-title">Selecciona tu Desafío</h2>
            <div class="game-grid">
                <div class="game-card card-flags" data-mode="flags">
                    <h2>Adivina la Bandera</h2>
                </div>
                <div class="game-card card-capitals" data-mode="capitals">
                    <h2>Adivina la Capital</h2>
                </div>
                <div class="game-card card-population" data-mode="population">
                    <h2>Mayor Población</h2>
                </div>
                <div class="game-card card-currency" data-mode="currency">
                    <h2>Moneda Oficial</h2>
                </div>
            </div>
        </div>
    `;

    // Añadir eventos a las tarjetas
    const cards = document.querySelectorAll('.game-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const mode = card.getAttribute('data-mode');
            startGame(mode);
        });
    });
};

/**
 * Inicia el juego según el modo seleccionado
 */
const startGame = (mode) => {
    console.log(`Iniciando juego: ${mode}`);
    state.gameMode = mode;
    state.view = 'game';
    
    // Mostrar barra de estadísticas
    document.getElementById('stats-bar')?.classList.remove('hidden');
    const scoreEl = document.getElementById('player-score');
    if (scoreEl) scoreEl.textContent = `Puntos: ${state.score}`;

    if (mode === 'flags') {
        initFlagsGame();
    } else {
        app.innerHTML = `
            <div class="game-container fade-in">
                <h2>Modo: ${mode.toUpperCase()}</h2>
                <p>Próximamente...</p>
                <button id="btn-back" class="btn-primary">Volver al Menú</button>
            </div>
        `;

        document.getElementById('btn-back').addEventListener('click', () => {
            state.view = 'menu';
            renderMenu();
        });
    }
};

/**
 * Renderiza una pregunta del juego de banderas
 */
export const renderFlagQuestion = (target, options) => {
    app.innerHTML = `
        <div class="game-container fade-in">
            <div class="flag-display-container">
                <img src="${target.flags.svg}" alt="Bandera a adivinar" class="flag-display shadow-lg">
            </div>
            
            <div class="options-grid">
                ${options.map(country => `
                    <button class="option-btn" data-cca3="${country.cca3}">
                        ${country.nombreEs}
                    </button>
                `).join('')}
            </div>
        </div>
    `;

    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Desactiva todos los botones después del click
            buttons.forEach(b => b.disabled = true);
            
            const selectedCca3 = btn.getAttribute('data-cca3');
            const { isCorrect, correctCca3 } = handleAnswer(selectedCca3);
            
            // Feedback visual
            if (isCorrect) {
                btn.classList.add('btn-correct');
            } else {
                btn.classList.add('btn-incorrect');
                // Mostrar la correcta
                const correctBtn = document.querySelector(`[data-cca3="${correctCca3}"]`);
                correctBtn?.classList.add('btn-correct');
            }

            // Pausa y siguiente pregunta
            setTimeout(() => {
                generateQuestion();
            }, 2000);
        });
    });
};

// Listeners para el Header (Navigation)
document.addEventListener('DOMContentLoaded', () => {
    const btnMenu = document.getElementById('btn-menu');
    if (btnMenu) {
        btnMenu.addEventListener('click', () => {
            state.view = 'menu';
            renderMenu();
        });
    }

    const btnExit = document.getElementById('btn-exit');
    if (btnExit) {
        btnExit.addEventListener('click', () => {
            if (confirm('¿Estás seguro de que deseas salir?')) {
                window.close();
                // O simplemente volver al menú si window.close no está permitido
                state.view = 'menu';
                renderMenu();
            }
        });
    }
});
