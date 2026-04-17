import { state } from '../state.js';
import { renderPopulationQuestion } from '../ui.js';
import { shuffle } from '../utils.js';

/**
 * Inicializa el juego de población
 */
export const initPopulationGame = () => {
    state.score = 0;
    state.streak = 0;
    state.lives = state.settings.maxLives;
    generatePopulationQuestion();
};

/**
 * Genera una nueva pregunta (compara 2 países)
 */
export const generatePopulationQuestion = () => {
    if (state.countries.length < 2) return;

    // Seleccionamos 2 países aleatorios
    // Intentamos que no tengan exactamente la misma población si es posible, 
    // aunque es raro en la API REST Countries
    const randomCountries = shuffle(state.countries).slice(0, 2);
    
    // Determinamos el ganador (el de mayor población)
    const winner = randomCountries[0].population >= randomCountries[1].population 
        ? randomCountries[0] 
        : randomCountries[1];
    
    // Guardamos la pregunta actual en el estado
    state.currentQuestion = {
        options: randomCountries,
        winner: winner
    };

    // Renderizamos la pregunta (esta función se definirá en ui.js)
    renderPopulationQuestion(state.currentQuestion.options, state.currentQuestion.winner);
};

/**
 * Maneja la respuesta del usuario
 * @param {string} selectedCca3 - El cca3 del país seleccionado
 */
export const handlePopulationAnswer = (selectedCca3) => {
    // Si selectedCca3 es null (timeout), es incorrecto
    const isCorrect = selectedCca3 === state.currentQuestion.winner.cca3;
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
        correctCca3: state.currentQuestion.winner.cca3,
        livesRemaining: state.lives
    };
};
