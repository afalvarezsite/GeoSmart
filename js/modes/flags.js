import { state } from '../state.js';
import { renderFlagQuestion } from '../ui.js';
import { shuffle } from '../utils.js';

/**
 * Inicializa el juego de banderas
 */
export const initFlagsGame = () => {
    state.score = 0;
    state.streak = 0;
    state.lives = state.settings.maxLives;
    generateQuestion();
};

/**
 * Genera una nueva pregunta
 */
export const generateQuestion = () => {
    if (state.countries.length < 4) return;

    // Seleccionamos 4 países aleatorios
    const randomCountries = shuffle(state.countries).slice(0, 4);
    
    // El objetivo es el primero de los 4 (o cualquiera, ya que están mezclados)
    const target = randomCountries[0];
    
    // Guardamos la pregunta actual en el estado
    state.currentQuestion = {
        target: target,
        options: shuffle(randomCountries) // Mezclamos las opciones para que el correcto no sea siempre el primero
    };

    // Renderizamos la pregunta con la URL SVG
    renderFlagQuestion(state.currentQuestion.target, state.currentQuestion.options);
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
