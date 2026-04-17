import { state } from '../state.js';
import { renderCapitalQuestion } from '../ui.js';
import { shuffle } from '../utils.js';

/**
 * Inicializa el juego de capitales
 */
export const initCapitalsGame = () => {
    state.score = 0;
    state.streak = 0;
    state.lives = state.settings.maxLives;
    generateCapitalQuestion();
};

/**
 * Genera una nueva pregunta de capitales
 */
export const generateCapitalQuestion = () => {
    // Filtrar países que tengan capital definida
    const validCountries = state.countries.filter(c => c.capital && c.capital.length > 0);
    
    if (validCountries.length < 4) return;

    // Seleccionamos 4 países aleatorios
    const randomCountries = shuffle(validCountries).slice(0, 4);
    
    // El objetivo es el primero
    const target = randomCountries[0];
    
    // Guardamos la pregunta actual en el estado
    state.currentQuestion = {
        target: target,
        options: shuffle(randomCountries)
    };

    // Renderizamos la pregunta enviando el país objetivo y las opciones (países completos)
    renderCapitalQuestion(state.currentQuestion.target, state.currentQuestion.options);
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
