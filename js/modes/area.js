import { state, getFilteredCountries } from '../state.js';
import { renderAreaQuestion } from '../ui.js';
import { shuffle } from '../utils.js';

/**
 * Inicializa el juego de extensión (Área)
 */
export const initAreaGame = () => {
    state.view = 'game';
    state.score = 0;
    state.streak = 0;
    state.lives = state.settings.maxLives;
    state.history = [];
    
    if (!state.currentQuestion) {
        generateAreaQuestion(false);
    }
    
    renderAreaQuestion(state.currentQuestion.options, state.currentQuestion.winner);
};

/**
 * Genera una nueva pregunta (compara 2 países de similar población para mayor dificultad)
 */
export const generateAreaQuestion = (render = true) => {
    const countries = getFilteredCountries();
    if (countries.length < 2) return;

    // Filtramos países que tengan datos válidos
    // Para el modo Área, ordenamos por población para buscar países con "densidades" que confundan al jugador
    const validCountries = countries
        .filter(c => c.population !== undefined && c.area !== undefined)
        .sort((a, b) => a.population - b.population);

    if (validCountries.length < 2) return;

    let countryA, countryB, pairKey;
    let attempts = 0;
    const MAX_ATTEMPTS = 15;

    do {
        const indexA = Math.floor(Math.random() * validCountries.length);
        countryA = validCountries[indexA];
        
        // 5% de probabilidad de caos total (países totalmente aleatorios)
        const isChaos = Math.random() < 0.05;

        if (isChaos) {
            let indexB;
            do {
                indexB = Math.floor(Math.random() * validCountries.length);
            } while (indexB === indexA);
            countryB = validCountries[indexB];
        } else {
            // Buscamos un "vecino" en la lista de población (rango de 8)
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
    if (state.history.length > 50) state.history.shift();
    
    const pair = shuffle([countryA, countryB]);
    
    // El ganador es el que tiene mayor área
    const winner = pair[0].area >= pair[1].area ? pair[0] : pair[1];
    
    state.currentQuestion = { options: pair, winner: winner };

    if (!pair[0] || !pair[1]) {
        console.error('Fallo crítico en generación de pareja para área');
        return generateAreaQuestion(render);
    }

    if (render) {
        renderAreaQuestion(state.currentQuestion.options, state.currentQuestion.winner);
    }
};

/**
 * Maneja la respuesta del usuario para el modo área
 * @param {string} selectedCca3 - El cca3 del país seleccionado
 */
export const handleAreaAnswer = (selectedCca3) => {
    const isCorrect = selectedCca3 === state.currentQuestion.winner.cca3;
    let lifeRecovered = false;
    
    if (isCorrect) {
        state.score += 1;
        state.streak += 1;
        
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
