import { state, getFilteredCountries } from '../state.js';
import { renderCapitalQuestion } from '../ui.js';
import { shuffle } from '../utils.js';

/**
 * Inicializa el juego de capitales
 */
export const initCapitalsGame = () => {
    state.view = 'game';
    state.score = 0;
    state.streak = 0;
    state.lives = state.settings.maxLives;
    state.history = []; // Inicializar historial
    
    if (!state.currentQuestion) {
        generateCapitalQuestion(false);
    }
    
    renderCapitalQuestion(state.currentQuestion.target, state.currentQuestion.options);
};

/**
 * Genera una nueva pregunta de capitales
 */
export const generateCapitalQuestion = (render = true) => {
    const countries = getFilteredCountries();
    const validCountries = countries.filter(c => c.capital && c.capital.length > 0);
    if (validCountries.length < 4) return;

    let target;
    let attempts = 0;
    const MAX_HISTORY_ATTEMPTS = 20;

    // Intentar obtener un país que no esté en el historial reciente
    do {
        const randomCountries = shuffle(validCountries).slice(0, 4);
        target = randomCountries[0];
        attempts++;
    } while (state.history.includes(target.cca3) && attempts < MAX_HISTORY_ATTEMPTS && validCountries.length > state.history.length + 4);

    // Guardar en el historial
    state.history.push(target.cca3);
    if (state.history.length > 50) state.history.shift();

    // Obtener opciones (incluyendo al target)
    const options = shuffle(shuffle(validCountries).filter(c => c.cca3 !== target.cca3).slice(0, 3).concat(target));
    
    state.currentQuestion = {
        target: target,
        options: options
    };

    if (render) {
        renderCapitalQuestion(state.currentQuestion.target, state.currentQuestion.options);
    }
};

/**
 * Evalúa la respuesta del usuario (comparando capitales)
 */
export const handleCapitalAnswer = (selectedCapital) => {
    const isCorrect = selectedCapital === state.currentQuestion.target.capital[0];
    let lifeRecovered = false;
    
    if (isCorrect) {
        state.score += 1;
        state.streak += 1;
        
        // Comprobar racha para recuperar vida
        const threshold = state.settings.streakThreshold;
        if (threshold > 0 && state.streak >= threshold) {
            if (state.lives < state.settings.maxLives) {
                state.lives += 1;
                lifeRecovered = true;
            }
            state.streak = 0;
        }

        const scoreEl = document.getElementById('player-score');
        if (scoreEl) scoreEl.textContent = `Puntos: ${state.score}`;
    } else {
        state.lives--;
        state.streak = 0;
    }

    return {
        isCorrect,
        lifeRecovered,
        correctCapital: state.currentQuestion.target.capital[0],
        livesRemaining: state.lives
    };
};
