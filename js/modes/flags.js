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
    if (state.countries.length < 4) return;

    const randomCountries = shuffle(state.countries).slice(0, 4);
    const target = randomCountries[0];
    
    state.currentQuestion = {
        target: target,
        options: shuffle(randomCountries)
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
