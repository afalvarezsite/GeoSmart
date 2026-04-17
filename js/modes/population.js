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
    state.history = [];
    
    if (!state.currentQuestion) {
        generatePopulationQuestion(false);
    }
    
    renderPopulationQuestion(state.currentQuestion.options, state.currentQuestion.winner);
};

/**
 * Genera una nueva pregunta (compara 2 países de similar extensión)
 */
export const generatePopulationQuestion = (render = true) => {
    if (state.countries.length < 2) return;

    const validCountries = state.countries
        .filter(c => c.population !== undefined && c.area !== undefined)
        .sort((a, b) => a.area - b.area);

    if (validCountries.length < 2) return;

    let countryA, countryB, pairKey;
    let attempts = 0;
    const MAX_ATTEMPTS = 15;

    do {
        const indexA = Math.floor(Math.random() * validCountries.length);
        countryA = validCountries[indexA];
        const isChaos = Math.random() < 0.05;

        if (isChaos) {
            let indexB;
            do {
                indexB = Math.floor(Math.random() * validCountries.length);
            } while (indexB === indexA);
            countryB = validCountries[indexB];
        } else {
            const RANGE = 8; 
            const minIdx = Math.max(0, indexA - RANGE);
            const maxIdx = Math.min(validCountries.length - 1, indexA + RANGE);
            let indexB;
            let neighborAttempts = 0;
            do {
                indexB = Math.floor(Math.random() * (maxIdx - minIdx + 1)) + minIdx;
                neighborAttempts++;
            } while (indexB === indexA && neighborAttempts < 10);
            countryB = validCountries[indexB];
        }

        pairKey = [countryA.cca3, countryB.cca3].sort().join('_');
        attempts++;
    } while (state.history.includes(pairKey) && attempts < MAX_ATTEMPTS);

    state.history.push(pairKey);
    if (state.history.length > 40) state.history.shift();
    
    const pair = shuffle([countryA, countryB]);
    const winner = pair[0].population >= pair[1].population ? pair[0] : pair[1];
    
    state.currentQuestion = { options: pair, winner: winner };

    if (!pair[0] || !pair[1]) {
        console.error('Fallo crítico en generación de pareja');
        return generatePopulationQuestion(render);
    }

    if (render) {
        renderPopulationQuestion(state.currentQuestion.options, state.currentQuestion.winner);
    }
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
