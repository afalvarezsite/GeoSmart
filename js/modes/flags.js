import { state, getFilteredCountries } from '../state.js';
import { renderFlagQuestion } from '../ui.js';
import { shuffle } from '../utils.js';

/**
 * Inicializa el juego de banderas
 */
export const initFlagsGame = () => {
    state.view = 'game';
    state.score = 0;
    state.streak = 0;
    state.lives = state.settings.maxLives;
    state.history = []; // Inicializar historial
    
    // Si no hay una pregunta pre-generada, la generamos ahora
    if (!state.currentQuestion) {
        generateQuestion(false);
    }
    
    renderFlagQuestion(state.currentQuestion.target, state.currentQuestion.options);
};

/**
 * Genera una nueva pregunta
 */
export const generateQuestion = (render = true) => {
    const countries = getFilteredCountries();
    if (countries.length < 4) return;

    let target;
    let attempts = 0;
    const MAX_HISTORY_ATTEMPTS = 20;

    // Intentar obtener un país que no esté en el historial reciente
    do {
        const randomCountries = shuffle(countries).slice(0, 4);
        target = randomCountries[0];
        attempts++;
    } while (state.history.includes(target.cca3) && attempts < MAX_HISTORY_ATTEMPTS && countries.length > state.history.length + 4);

    // Guardar en el historial
    state.history.push(target.cca3);
    if (state.history.length > 50) state.history.shift();

    // Obtener opciones (incluyendo al target)
    const options = shuffle(shuffle(countries).filter(c => c.cca3 !== target.cca3).slice(0, 3).concat(target));
    
    state.currentQuestion = {
        target: target,
        options: options
    };

    if (render) {
        renderFlagQuestion(state.currentQuestion.target, state.currentQuestion.options);
    }
};

export const handleAnswer = (selectedCca3) => {
    const isCorrect = selectedCca3 === state.currentQuestion.target.cca3;
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
            state.streak = 0; // Reiniciar racha tras recuperar vida o al tope
        }

        const scoreEl = document.getElementById('player-score');
        if (scoreEl) scoreEl.textContent = `Puntos: ${state.score}`;
    } else {
        state.lives--;
        state.streak = 0; // Romper racha
    }

    return {
        isCorrect,
        lifeRecovered,
        correctCca3: state.currentQuestion.target.cca3,
        livesRemaining: state.lives
    };
};
