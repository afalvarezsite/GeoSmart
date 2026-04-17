import { state, saveSettings, resetSettings } from './state.js';
import { formatCurrency } from './utils.js';
import { initFlagsGame, handleAnswer as handleFlagsAnswer, generateQuestion as generateFlagsQuestion } from './modes/flags.js';
import { initCapitalsGame, handleCapitalAnswer, generateCapitalQuestion } from './modes/capitals.js';
import { initPopulationGame, handlePopulationAnswer, generatePopulationQuestion } from './modes/population.js';
import { initCurrencyGame, handleCurrencyAnswer, generateCurrencyQuestion, getCurrencyString } from './modes/currency.js';

const app = document.getElementById('app');
let timerInterval = null;
let transitionTimeout = null;
let isTransitioning = false;

/**
 * Detiene toda la lógica activa del juego (temporizadores y transiciones)
 */
const stopGameLogic = () => {
    isTransitioning = false;
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    if (transitionTimeout) {
        // Puede ser un timeout o un interval
        clearInterval(transitionTimeout);
        clearTimeout(transitionTimeout);
        transitionTimeout = null;
    }
};

/**
 * Renderiza un mensaje de error con opción de reintentar
 */
export const renderError = (message) => {
    stopGameLogic();
    app.innerHTML = `
        <div class="menu-container error-state fade-in">
            <div class="error-icon">⚠️</div>
            <h2 class="menu-title">¡Ups! Algo salió mal</h2>
            <p class="error-message">${message}</p>
            <button id="btn-retry" class="btn-primary btn-large">Reintentar Conexión</button>
        </div>
    `;

    document.getElementById('btn-retry')?.addEventListener('click', () => {
        window.location.reload();
    });
};

/**
 * Renderiza el menú principal de selección de juegos
 */
export const renderMenu = () => {
    stopGameLogic();
    
    // Si hay un error crítico guardado, lo mostramos
    if (state.error) {
        renderError(state.error);
        return;
    }

    // Asegurar que la barra de estadísticas esté oculta en el menú
    document.getElementById('stats-bar')?.classList.add('hidden');
    
    app.innerHTML = `
        <div class="menu-container fade-in">
            <h2 class="menu-title">Selecciona tu Desafío</h2>
            ${state.loading ? '<div class="loader inline">Cargando datos del mundo...</div>' : ''}
            <div class="game-grid ${state.loading ? 'loading-overlay' : ''}">
                <div class="game-card card-flags" data-mode="flags">
                    <div class="card-content">
                        <h2>Adivina la Bandera</h2>
                        <p>Pon a prueba tu memoria visual con las banderas de todas las naciones del mundo.</p>
                        <span class="btn-play">Jugar Ahora</span>
                    </div>
                </div>
                <div class="game-card card-capitals" data-mode="capitals">
                    <div class="card-content">
                        <h2>Adivina la Capital</h2>
                        <p>Demuestra tu conocimiento geográfico identificando las capitales de cada país.</p>
                        <span class="btn-play">Jugar Ahora</span>
                    </div>
                </div>
                <div class="game-card card-population" data-mode="population">
                    <div class="card-content">
                        <h2>Mayor Población</h2>
                        <p>Un desafío de lógica y datos: ¿cuál de estos dos países tiene más habitantes?</p>
                        <span class="btn-play">Jugar Ahora</span>
                    </div>
                </div>
                <div class="game-card card-currency" data-mode="currency">
                    <div class="card-content">
                        <h2>Moneda Oficial</h2>
                        <p>Desde el Euro hasta el Yen, identifica la divisa oficial de cada territorio.</p>
                        <span class="btn-play">Jugar Ahora</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Si aún está cargando, no añadimos listeners (o podríamos añadir uno que avise)
    if (state.loading) return;

    // Añadir eventos a las tarjetas utilizando delegación para el grid
    const grid = document.querySelector('.game-grid');
    grid.addEventListener('click', (e) => {
        const card = e.target.closest('.game-card');
        if (card) {
            const mode = card.getAttribute('data-mode');
            startGame(mode);
        }
    });
};

/**
 * Inicia el juego según el modo seleccionado
 */
const startGame = (mode) => {
    console.log(`Iniciando juego: ${mode}`);
    state.gameMode = mode;
    
    if (mode === 'flags' || mode === 'capitals' || mode === 'population' || mode === 'currency') {
        renderCountdown(mode);
        return;
    }

    state.view = 'game';
    
    // Mostrar barra de estadísticas
    document.getElementById('stats-bar')?.classList.remove('hidden');
    const scoreEl = document.getElementById('player-score');
    if (scoreEl) scoreEl.textContent = `Puntos: ${state.score}`;

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
};

/**
 * Renderiza la cuenta regresiva antes de empezar el juego
 */
const renderCountdown = (mode) => {
    stopGameLogic();
    state.view = 'countdown';
    document.getElementById('stats-bar')?.classList.add('hidden');

    let count = 3;
    
    app.innerHTML = `
        <div class="countdown-container fade-in">
            <div id="countdown-val" class="countdown-number">${count}</div>
            <div id="countdown-text" class="countdown-text">Prepárate...</div>
        </div>
    `;

    const countdownVal = document.getElementById('countdown-val');
    const countdownText = document.getElementById('countdown-text');

    transitionTimeout = setInterval(() => {
        count--;
        
        if (state.view !== 'countdown') {
            stopGameLogic();
            return;
        }

        if (count > 0) {
            countdownVal.textContent = count;
        } else if (count === 0) {
            countdownVal.textContent = '¡YA!';
            if (countdownText) countdownText.textContent = '¡Es tu turno!';
        } else {
            stopGameLogic();
            
            // Mostrar barra de estadísticas justo antes de empezar
            document.getElementById('stats-bar')?.classList.remove('hidden');
            const scoreEl = document.getElementById('player-score');
            if (scoreEl) scoreEl.textContent = `Puntos: ${state.score}`;
            
            state.view = 'game';

            if (mode === 'flags') {
                initFlagsGame();
            } else if (mode === 'capitals') {
                initCapitalsGame();
            } else if (mode === 'population') {
                initPopulationGame();
            } else if (mode === 'currency') {
                initCurrencyGame();
            }
        }
    }, 1000);
};

/**
 * Renderiza los corazones de vida actuales
 */
const renderLives = () => {
    const totalLives = state.settings.maxLives; // Usamos el máximo configurado
    let hearts = '';
    for (let i = 0; i < totalLives; i++) {
        if (i < state.lives) {
            hearts += `<img src="assets/pixel_heart.svg" class="life-heart" alt="Vida">`;
        } else {
            hearts += `<img src="assets/pixel_heart_empty.svg" class="life-heart empty" alt="Vida perdida">`;
        }
    }
    return hearts;
};

/**
 * Renderiza la pantalla de configuración
 */
export const renderSettings = () => {
    stopGameLogic();
    state.view = 'settings';
    document.getElementById('stats-bar')?.classList.add('hidden');

    app.innerHTML = `
        <div class="settings-container fade-in">
            <h2 class="menu-title">Configuración</h2>
            
            <div class="settings-card">
                <div class="settings-section">
                    <h3 class="settings-section-title">Generales</h3>
                    <div class="setting-group">
                        <label for="max-lives">
                            Número de Vidas
                            <span>(Define cuántos fallos se permiten antes de perder)</span>
                        </label>
                        <div class="input-row">
                            <input type="range" id="max-lives" class="custom-range" min="1" max="10" value="${state.settings.maxLives}">
                            <span id="lives-value" class="value-display">${state.settings.maxLives}</span>
                        </div>
                    </div>

                    <div class="setting-group">
                        <label for="question-time">
                            Tiempo por Pregunta
                            <span>(Segundos disponibles para responder)</span>
                        </label>
                        <div class="input-row">
                            <input type="range" id="question-time" class="custom-range" min="3" max="16" value="${state.settings.questionTime}">
                            <span id="time-value" class="value-display">${state.settings.questionTime === 16 ? '∞' : state.settings.questionTime + 's'}</span>
                        </div>
                    </div>

                    <div class="setting-group">
                        <label for="streak-threshold">
                            Racha para Recuperar Vida
                            <span>(Aciertos seguidos para ganar +1 vida. 0 = Desactivado)</span>
                        </label>
                        <div class="input-row">
                            <input type="range" id="streak-threshold" class="custom-range" min="0" max="10" value="${state.settings.streakThreshold}">
                            <span id="streak-value" class="value-display">${state.settings.streakThreshold || 'OFF'}</span>
                        </div>
                    </div>
                </div>

                <div class="settings-section">
                    <h3 class="settings-section-title">Modo Capitales</h3>
                    <div class="setting-group flex-between">
                        <label for="show-flag-capitals">
                            Mostrar Bandera en Capitales
                            <span>(Ayuda visual adicional para identificar el país)</span>
                        </label>
                        <input type="checkbox" id="show-flag-capitals" class="neo-switch" ${state.settings.showFlagInCapitals ? 'checked' : ''}>
                    </div>
                </div>

                <div class="settings-section">
                    <h3 class="settings-section-title">Modo Población</h3>
                    <div class="setting-group flex-between">
                        <label for="show-area-population">
                            Mostrar Extensión en Población
                            <span>(Muestra los km² para ayudar a comparar)</span>
                        </label>
                        <input type="checkbox" id="show-area-population" class="neo-switch" ${state.settings.showAreaInPopulation ? 'checked' : ''}>
                    </div>

                    <div class="setting-group flex-between">
                        <label for="show-gdp-population">
                            Mostrar PIB en Población
                            <span>(Muestra el PIB del Banco Mundial)</span>
                        </label>
                        <input type="checkbox" id="show-gdp-population" class="neo-switch" ${state.settings.showGDPInPopulation ? 'checked' : ''}>
                    </div>
                </div>

                <div class="settings-section">
                    <h3 class="settings-section-title">Modo Monedas</h3>
                    <div class="setting-group flex-between">
                        <label for="show-flag-currency">
                            Mostrar Bandera en Monedas
                            <span>(Identifica el país más fácilmente)</span>
                        </label>
                        <input type="checkbox" id="show-flag-currency" class="neo-switch" ${state.settings.showFlagInCurrency ? 'checked' : ''}>
                    </div>

                    <div class="setting-group flex-between">
                        <label for="show-details-currency">
                            Mostrar Detalles Geográficos
                            <span>(Continente y subregión como pista extra)</span>
                        </label>
                        <input type="checkbox" id="show-details-currency" class="neo-switch" ${state.settings.showDetailsInCurrency ? 'checked' : ''}>
                    </div>
                </div>

                <div class="settings-actions">
                    <button id="btn-save-settings" class="btn-primary btn-large">Guardar Cambios</button>
                    <button id="btn-cancel-settings" class="btn-secondary">Cancelar</button>
                    <button id="btn-reset-settings" class="btn-danger">Restaurar Defectos</button>
                </div>
            </div>
        </div>
    `;

    const livesInput = document.getElementById('max-lives');
    const livesValue = document.getElementById('lives-value');
    const timeInput = document.getElementById('question-time');
    const timeValue = document.getElementById('time-value');
    const streakInput = document.getElementById('streak-threshold');
    const streakValue = document.getElementById('streak-value');
    const flagToggle = document.getElementById('show-flag-capitals');
    const areaToggle = document.getElementById('show-area-population');
    const gdpToggle = document.getElementById('show-gdp-population');
    const flagCurrToggle = document.getElementById('show-flag-currency');
    const detailsCurrToggle = document.getElementById('show-details-currency');
    
    livesInput.addEventListener('input', (e) => {
        livesValue.textContent = e.target.value;
    });

    timeInput.addEventListener('input', (e) => {
        timeValue.textContent = e.target.value === "16" ? '∞' : `${e.target.value}s`;
    });

    streakInput.addEventListener('input', (e) => {
        streakValue.textContent = e.target.value === "0" ? 'OFF' : e.target.value;
    });

    document.getElementById('btn-save-settings').addEventListener('click', () => {
        const newMaxLives = parseInt(livesInput.value);
        const newQuestionTime = parseInt(timeInput.value);
        const newStreakThreshold = parseInt(streakInput.value);
        const newShowFlag = flagToggle.checked;
        const newShowArea = areaToggle.checked;
        const newShowGDP = gdpToggle.checked;
        saveSettings({ 
            maxLives: newMaxLives,
            questionTime: newQuestionTime,
            streakThreshold: newStreakThreshold,
            showFlagInCapitals: newShowFlag,
            showAreaInPopulation: newShowArea,
            showGDPInPopulation: newShowGDP,
            showFlagInCurrency: flagCurrToggle.checked,
            showDetailsInCurrency: detailsCurrToggle.checked
        });
        renderMenu();
    });

    document.getElementById('btn-reset-settings').addEventListener('click', () => {
        if (confirm('¿Estás seguro de que deseas restaurar la configuración por defecto?')) {
            resetSettings();
            renderSettings(); // Re-renderizar para ver los cambios
        }
    });

    document.getElementById('btn-cancel-settings').addEventListener('click', () => {
        renderMenu();
    });
};

/**
 * Renderiza la pantalla de fin de juego
 */
export const renderGameOver = () => {
    state.view = 'results';
    // Ocultar barra de estadísticas en el game over para limpieza visual
    document.getElementById('stats-bar')?.classList.add('hidden');
    
    app.innerHTML = `
        <div class="game-container fade-in text-center">
            <h2 class="game-over-title">¡Desafío Terminado!</h2>
            <div class="score-summary">
                <p>Puntuación Final</p>
                <div class="final-score">${state.score}</div>
            </div>
            <div class="results-actions">
                <button id="btn-restart" class="btn-primary btn-large">Reintentar</button>
                <button id="btn-back-menu" class="btn-secondary">Volver al Menú</button>
            </div>
        </div>
    `;

    document.getElementById('btn-restart').addEventListener('click', () => {
        if (state.gameMode === 'flags') {
            initFlagsGame();
        } else if (state.gameMode === 'capitals') {
            initCapitalsGame();
        } else if (state.gameMode === 'population') {
            initPopulationGame();
        } else if (state.gameMode === 'currency') {
            initCurrencyGame();
        }
    });

    document.getElementById('btn-back-menu').addEventListener('click', () => {
        state.view = 'menu';
        renderMenu();
    });
};

/**
 * Pre-carga una imagen (bandera) para evitar parpadeos
 */
const preloadFlag = (url) => {
    if (!url) return;
    const img = new Image();
    img.src = url;
};

/**
 * Inicia el temporizador para la pregunta actual
 */
const startTimer = (correctCca3) => {
    const timerBar = document.getElementById('timer-bar');
    if (!timerBar) return;

    let timeLeft = state.settings.questionTime * 1000;
    const totalTime = timeLeft;
    const intervalTime = 50; // Actualización cada 50ms para suavidad

    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        timeLeft -= intervalTime;
        const percentage = (timeLeft / totalTime) * 100;
        
        if (timerBar) {
            timerBar.style.width = `${percentage}%`;
            
            // Cambiar color según el tiempo restante
            if (percentage > 60) {
                timerBar.style.background = 'linear-gradient(to right, #10b981, #059669)'; // Verde
                timerBar.style.boxShadow = '0 0 15px rgba(16, 185, 129, 0.4)';
            } else if (percentage > 30) {
                timerBar.style.background = 'linear-gradient(to right, #facc15, #eab308)'; // Amarillo
                timerBar.style.boxShadow = '0 0 15px rgba(234, 179, 8, 0.4)';
            } else {
                timerBar.style.background = 'linear-gradient(to right, #ef4444, #dc2626)'; // Rojo
                timerBar.style.boxShadow = '0 0 15px rgba(239, 68, 68, 0.4)';
            }
        }

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleTimeout(correctCca3);
        }
    }, intervalTime);
};

/**
 * Maneja el evento de tiempo agotado
 */
const handleTimeout = (correctCca3) => {
    if (isTransitioning) return;
    isTransitioning = true;

    // Desactivar botones de opción
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach(b => b.disabled = true);

    // Desactivar tarjetas de población (si aplica)
    const cards = document.querySelectorAll('.country-card-large');
    cards.forEach(c => c.style.pointerEvents = 'none');

    // Ejecutar lógica de fallo por tiempo
    let result;
    if (state.gameMode === 'flags') {
        result = handleFlagsAnswer(null);
    } else if (state.gameMode === 'capitals') {
        result = handleCapitalAnswer(null);
    } else if (state.gameMode === 'population') {
        result = handlePopulationAnswer(null);
    } else if (state.gameMode === 'currency') {
        result = handleCurrencyAnswer(null);
    }
    
    const { lifeRecovered } = result;

    // Feedback visual
    const livesDisplay = document.getElementById('lives-display');
    if (livesDisplay) {
        livesDisplay.innerHTML = renderLives();
        
        if (lifeRecovered) {
            showLifeUpFeedback();
        }
    }

    // Mostrar cual era la correcta
    if (state.gameMode === 'flags') {
        const correctBtn = document.querySelector(`[data-cca3="${result.correctCca3}"]`);
        correctBtn?.classList.add('btn-correct');
    } else if (state.gameMode === 'capitals') {
        const correctBtn = document.querySelector(`[data-id="${result.correctCapital}"]`);
        correctBtn?.classList.add('btn-correct');
    } else if (state.gameMode === 'population') {
        const correctCard = document.querySelector(`[data-cca3="${result.correctCca3}"]`);
        correctCard?.classList.add('card-correct');
    } else if (state.gameMode === 'currency') {
        const correctBtn = document.querySelector(`[data-id="${result.correctCurrency}"]`);
        correctBtn?.classList.add('btn-correct');
    }

    // Pausa y siguiente paso
    transitionTimeout = setTimeout(() => {
        if (state.view !== 'game') return; // Seguridad extra
        
        if (state.lives <= 0) {
            renderGameOver();
        } else {
            if (state.gameMode === 'flags') generateFlagsQuestion();
            else if (state.gameMode === 'capitals') generateCapitalQuestion();
            else if (state.gameMode === 'population') generatePopulationQuestion();
            else if (state.gameMode === 'currency') generateCurrencyQuestion();
        }
    }, 2000);
};

/**
 * Renderiza una pregunta del juego de banderas
 */
export const renderFlagQuestion = (target, options) => {
    // Limpiar cualquier lógica previa
    stopGameLogic();

    const isIndefinite = state.settings.questionTime === 16;
    
    // Pre-cargar bandera actual
    preloadFlag(target.flags.svg);

    app.innerHTML = `
        <div class="game-container fade-in">
            <div id="lives-display" class="lives-container">
                ${renderLives()}
            </div>

            <div id="life-up-notification" class="life-up-container"></div>

            ${!isIndefinite ? `
                <div class="timer-container">
                    <div id="timer-bar" class="timer-bar"></div>
                </div>
            ` : ''}

            <div class="flag-display-container">
                <img src="${target.flags.svg}" alt="Bandera a adivinar" class="flag-display">
            </div>
            
            <div class="options-grid" id="options-grid">
                ${options.map(country => `
                    <button class="option-btn" data-cca3="${country.cca3}">
                        ${country.nombreEs}
                    </button>
                `).join('')}
            </div>
        </div>
    `;

    // Iniciar temporizador solo si no es indefinido
    if (!isIndefinite) {
        startTimer(target.cca3);
    }

    const grid = document.getElementById('options-grid');
    grid.addEventListener('click', (e) => {
        const btn = e.target.closest('.option-btn');
        if (!btn || isTransitioning) return;
        
        // Detener temporizador inmediatamente al responder
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }

        isTransitioning = true;
        
        // Desactiva todos los botones después del click
        const buttons = grid.querySelectorAll('.option-btn');
        buttons.forEach(b => b.disabled = true);
        
        const selectedCca3 = btn.getAttribute('data-cca3');
        const { isCorrect, correctCca3, lifeRecovered } = handleFlagsAnswer(selectedCca3);
        
        // Feedback visual
        if (isCorrect) {
            btn.classList.add('btn-correct');
            
            if (lifeRecovered) {
                const livesDisplay = document.getElementById('lives-display');
                if (livesDisplay) {
                    livesDisplay.innerHTML = renderLives();
                    showLifeUpFeedback();
                }
            }
        } else {
            btn.classList.add('btn-incorrect');
            const livesDisplay = document.getElementById('lives-display');
            if (livesDisplay) livesDisplay.innerHTML = renderLives();

            const correctBtn = grid.querySelector(`[data-cca3="${correctCca3}"]`);
            correctBtn?.classList.add('btn-correct');
        }

        transitionTimeout = setTimeout(() => {
            if (state.view !== 'game') return;
            if (state.lives <= 0) renderGameOver();
            else generateFlagsQuestion();
        }, 2000);
    });
};

/**
 * Renderiza una pregunta del juego de capitales
 */
export const renderCapitalQuestion = (target, options) => {
    stopGameLogic();
    const isIndefinite = state.settings.questionTime === 16;
    preloadFlag(target.flags.svg);

    app.innerHTML = `
        <div class="game-container fade-in">
            <div id="lives-display" class="lives-container">
                ${renderLives()}
            </div>

            <div id="life-up-notification" class="life-up-container"></div>

            ${!isIndefinite ? `
                <div class="timer-container">
                    <div id="timer-bar" class="timer-bar"></div>
                </div>
            ` : ''}

            <div class="capital-question-display">
                <span class="country-name-badge">${target.nombreEs}</span>
                ${state.settings.showFlagInCapitals ? `
                    <div class="flag-display-container mini">
                        <img src="${target.flags.svg}" alt="Bandera del país" class="flag-display">
                    </div>
                ` : ''}
            </div>
            
            <div class="options-grid" id="options-grid">
                ${options.map(country => `
                    <button class="option-btn" data-id="${country.capital[0]}">
                        ${country.capital[0]}
                    </button>
                `).join('')}
            </div>
        </div>
    `;

    if (!isIndefinite) startTimer(target.capital[0]);

    const grid = document.getElementById('options-grid');
    grid.addEventListener('click', (e) => {
        const btn = e.target.closest('.option-btn');
        if (!btn || isTransitioning) return;

        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }

        isTransitioning = true;
        const buttons = grid.querySelectorAll('.option-btn');
        buttons.forEach(b => b.disabled = true);
        
        const selectedCapital = btn.getAttribute('data-id');
        const { isCorrect, correctCapital, lifeRecovered } = handleCapitalAnswer(selectedCapital);
        
        if (isCorrect) {
            btn.classList.add('btn-correct');
            if (lifeRecovered) {
                const livesDisplay = document.getElementById('lives-display');
                if (livesDisplay) {
                    livesDisplay.innerHTML = renderLives();
                    showLifeUpFeedback();
                }
            }
        } else {
            btn.classList.add('btn-incorrect');
            const livesDisplay = document.getElementById('lives-display');
            if (livesDisplay) livesDisplay.innerHTML = renderLives();

            const correctBtn = grid.querySelector(`[data-id="${correctCapital}"]`);
            correctBtn?.classList.add('btn-correct');
        }

        transitionTimeout = setTimeout(() => {
            if (state.view !== 'game') return;
            if (state.lives <= 0) renderGameOver();
            else generateCapitalQuestion();
        }, 2000);
    });
};

/**
 * Renderiza una pregunta del juego de población (comparación)
 */
export const renderPopulationQuestion = (options, winner) => {
    stopGameLogic();
    const isIndefinite = state.settings.questionTime === 16;
    
    // Pre-cargar ambas banderas
    options.forEach(opt => preloadFlag(opt.flags.svg));

    app.innerHTML = `
        <div class="game-container fade-in">
            <div id="lives-display" class="lives-container">
                ${renderLives()}
            </div>

            <div id="life-up-notification" class="life-up-container"></div>

            ${!isIndefinite ? `
                <div class="timer-container">
                    <div id="timer-bar" class="timer-bar"></div>
                </div>
            ` : ''}

            <h2 class="question-title">¿Cuál tiene más habitantes?</h2>
            
            <div class="comparison-grid" id="comparison-grid">
                ${options.map(country => `
                    <div class="country-card-large" data-cca3="${country.cca3}">
                        <div class="flag-wrapper">
                            <img src="${country.flags.svg}" alt="Bandera de ${country.nombreEs}" class="flag-img">
                        </div>
                        <h3 class="country-name">${country.nombreEs}</h3>
                        <div class="country-info">
                            ${state.settings.showAreaInPopulation ? `
                                <div class="info-badge">
                                    <span class="label">Extensión:</span>
                                    <span class="value">${country.area ? country.area.toLocaleString() : 'N/A'} km²</span>
                                </div>
                            ` : ''}
                            <div class="info-badge">
                                <span class="label">Continente:</span>
                                <span class="value">${country.continentesEs ? country.continentesEs[0] : 'N/A'}</span>
                            </div>
                            <div class="info-badge">
                                <span class="label">Subregión:</span>
                                <span class="value">${country.subregionEs || 'N/A'}</span>
                            </div>
                            ${state.settings.showGDPInPopulation ? `
                            <div class="info-badge">
                                <span class="label">PIB:</span>
                                <span class="value">${formatCurrency(country.pib)}</span>
                            </div>
                            ` : ''}
                        </div>
                        <div class="population-reveal hidden">
                            <span class="pop-number">${country.population.toLocaleString()}</span> habitantes
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    if (!isIndefinite) startTimer(winner.cca3);

    const grid = document.getElementById('comparison-grid');
    grid.addEventListener('click', (e) => {
        const card = e.target.closest('.country-card-large');
        if (!card || isTransitioning) return;

        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }

        isTransitioning = true;
        const cards = grid.querySelectorAll('.country-card-large');
        cards.forEach(c => c.style.pointerEvents = 'none');
        
        const selectedCca3 = card.getAttribute('data-cca3');
        const { isCorrect, correctCca3, lifeRecovered } = handlePopulationAnswer(selectedCca3);
        
        // Revelar poblaciones
        grid.querySelectorAll('.population-reveal').forEach(el => el.classList.remove('hidden'));
        
        if (isCorrect) {
            card.classList.add('card-correct');
            if (lifeRecovered) {
                const livesDisplay = document.getElementById('lives-display');
                if (livesDisplay) {
                    livesDisplay.innerHTML = renderLives();
                    showLifeUpFeedback();
                }
            }
        } else {
            card.classList.add('card-incorrect');
            const livesDisplay = document.getElementById('lives-display');
            if (livesDisplay) livesDisplay.innerHTML = renderLives();

            const correctCard = grid.querySelector(`[data-cca3="${correctCca3}"]`);
            correctCard?.classList.add('card-correct');
        }

        transitionTimeout = setTimeout(() => {
            if (state.view !== 'game') return;
            if (state.lives <= 0) renderGameOver();
            else generatePopulationQuestion();
        }, 3000);
    });
};

/**
 * Renderiza una pregunta del juego de monedas
 */
export const renderCurrencyQuestion = (target, options) => {
    stopGameLogic();
    const isIndefinite = state.settings.questionTime === 16;
    preloadFlag(target.flags.svg);

    app.innerHTML = `
        <div class="game-container fade-in">
            <div id="lives-display" class="lives-container">
                ${renderLives()}
            </div>

            <div id="life-up-notification" class="life-up-container"></div>

            ${!isIndefinite ? `
                <div class="timer-container">
                    <div id="timer-bar" class="timer-bar"></div>
                </div>
            ` : ''}

            <div class="currency-question-display">
                <h2 class="country-name-title">${target.nombreEs}</h2>
                
                ${state.settings.showFlagInCurrency ? `
                    <div class="flag-display-container mini-medium">
                        <img src="${target.flags.svg}" alt="Bandera de ${target.nombreEs}" class="flag-display">
                    </div>
                ` : ''}

                ${state.settings.showDetailsInCurrency ? `
                    <div class="country-details-row">
                        <span class="detail-badge">${target.continentesEs[0]}</span>
                        <span class="detail-badge">${target.subregionEs}</span>
                    </div>
                ` : ''}
                
                <p class="question-text">¿Cuál es su moneda oficial?</p>
            </div>
            
            <div class="options-grid" id="options-grid">
                ${options.map(country => {
                    const currencyStr = getCurrencyString(country);
                    return `
                        <button class="option-btn" data-id="${currencyStr}">
                            ${currencyStr}
                        </button>
                    `;
                }).join('')}
            </div>
        </div>
    `;

    if (!isIndefinite) startTimer(getCurrencyString(target));

    const grid = document.getElementById('options-grid');
    grid.addEventListener('click', (e) => {
        const btn = e.target.closest('.option-btn');
        if (!btn || isTransitioning) return;

        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }

        isTransitioning = true;
        const buttons = grid.querySelectorAll('.option-btn');
        buttons.forEach(b => b.disabled = true);
        
        const selectedCurrency = btn.getAttribute('data-id');
        const { isCorrect, correctCurrency, lifeRecovered } = handleCurrencyAnswer(selectedCurrency);
        
        if (isCorrect) {
            btn.classList.add('btn-correct');
            if (lifeRecovered) {
                const livesDisplay = document.getElementById('lives-display');
                if (livesDisplay) {
                    livesDisplay.innerHTML = renderLives();
                    showLifeUpFeedback();
                }
            }
        } else {
            btn.classList.add('btn-incorrect');
            const livesDisplay = document.getElementById('lives-display');
            if (livesDisplay) livesDisplay.innerHTML = renderLives();

            const correctBtn = grid.querySelector(`[data-id="${correctCurrency}"]`);
            correctBtn?.classList.add('btn-correct');
        }

        transitionTimeout = setTimeout(() => {
            if (state.view !== 'game') return;
            if (state.lives <= 0) renderGameOver();
            else generateCurrencyQuestion();
        }, 2000);
    });
};

/**
 * Muestra un feedback visual de vida recuperada
 */
const showLifeUpFeedback = () => {
    const container = document.getElementById('life-up-notification');
    if (!container) return;

    const el = document.createElement('div');
    el.className = 'life-up-feedback';
    el.innerHTML = `
        <img src="assets/pixel_heart.svg" class="mini-heart">
        <span>+1 VIDA</span>
    `;
    
    container.appendChild(el);
    
    // Limpiar el elemento después de la animación
    setTimeout(() => {
        el.remove();
    }, 2000);
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

    const btnSettings = document.getElementById('btn-settings');
    if (btnSettings) {
        btnSettings.addEventListener('click', () => {
            renderSettings();
        });
    }

    const btnNewGame = document.getElementById('btn-new-game');
    if (btnNewGame) {
        btnNewGame.addEventListener('click', () => {
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
