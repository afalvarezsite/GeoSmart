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
    state.history = []; // Limpiamos el historial de la sesión
    generatePopulationQuestion();
};

/**
 * Genera una nueva pregunta (compara 2 países de similar extensión)
 */
export const generatePopulationQuestion = () => {
    if (state.countries.length < 2) return;

    // 1. Crear una lista de países válidos ordenada por extensión
    const validCountries = state.countries
        .filter(c => c.population !== undefined && c.area !== undefined)
        .sort((a, b) => a.area - b.area);

    if (validCountries.length < 2) return;

    let countryA, countryB, pairKey;
    let attempts = 0;
    const maxGlobalAttempts = 15;

    // 2. Intentar generar una pareja que no esté en el historial reciente
    do {
        const indexA = Math.floor(Math.random() * validCountries.length);
        countryA = validCountries[indexA];
        
        const isChaosSelection = Math.random() < 0.05;

        if (isChaosSelection) {
            do {
                const randomIdx = Math.floor(Math.random() * validCountries.length);
                countryB = validCountries[randomIdx];
            } while (countryB.cca3 === countryA.cca3);
        } else {
            const range = 8; 
            const minIdx = Math.max(0, indexA - range);
            const maxIdx = Math.min(validCountries.length - 1, indexA + range);
            
            let indexB;
            let neighborAttempts = 0;
            do {
                indexB = Math.floor(Math.random() * (maxIdx - minIdx + 1)) + minIdx;
                neighborAttempts++;
            } while (indexB === indexA && neighborAttempts < 10);
            
            countryB = validCountries[indexB];
        }

        // Crear una clave única para la pareja (ordenada alfabéticamente)
        pairKey = [countryA.cca3, countryB.cca3].sort().join('_');
        attempts++;

        // Si ya está en el historial, reintentamos hasta maxGlobalAttempts veces
    } while (state.history.includes(pairKey) && attempts < maxGlobalAttempts);

    // Guardar en el historial (manteniendo solo los últimos 40 para no quedarse sin opciones)
    state.history.push(pairKey);
    if (state.history.length > 40) state.history.shift();
    
    // Mezclamos el par para la UI
    const pair = shuffle([countryA, countryB]);
    
    // Determinamos el ganador
    const winner = pair[0].population >= pair[1].population 
        ? pair[0] 
        : pair[1];
    
    // Guardamos la pregunta actual
    state.currentQuestion = {
        options: pair,
        winner: winner
    };

    // Renderizamos la pregunta
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
