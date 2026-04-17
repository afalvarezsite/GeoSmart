import { state } from '../state.js';
import { renderCurrencyQuestion } from '../ui.js';
import { shuffle, translateCurrency, simplifyCurrency } from '../utils.js';

/**
 * Inicializa el juego de monedas
 */
export const initCurrencyGame = () => {
    state.score = 0;
    state.streak = 0;
    state.lives = state.settings.maxLives;
    
    if (!state.currentQuestion) {
        generateCurrencyQuestion(false);
    }
    
    renderCurrencyQuestion(state.currentQuestion.target, state.currentQuestion.options);
};

/**
 * Genera una nueva pregunta de monedas
 */
export const generateCurrencyQuestion = (render = true) => {
    const validCountries = state.countries.filter(c => c.currencies && Object.keys(c.currencies).length > 0);
    if (validCountries.length < 4) return;

    const target = shuffle(validCountries)[0];
    const targetCurrency = getCurrencyString(target);
    const options = [target];
    const seenCurrencies = new Set([targetCurrency]);
    const otherCountries = shuffle(validCountries.filter(c => c.cca3 !== target.cca3));
    
    for (const country of otherCountries) {
        if (options.length >= 4) break;
        const currStr = getCurrencyString(country);
        if (!seenCurrencies.has(currStr)) {
            options.push(country);
            seenCurrencies.add(currStr);
        }
    }
    
    if (options.length < 4) {
        const fallback = shuffle(validCountries).slice(0, 4);
        state.currentQuestion = { target: fallback[0], options: shuffle(fallback) };
    } else {
        state.currentQuestion = {
            target: target,
            options: shuffle(options)
        };
    }

    if (render) {
        renderCurrencyQuestion(state.currentQuestion.target, state.currentQuestion.options);
    }
};

/**
 * Obtiene el string legible de la moneda (Nombre + Símbolo)
 */
export const getCurrencyString = (country) => {
    if (!country.currencies) return 'N/A';
    const firstKey = Object.keys(country.currencies)[0];
    const curr = country.currencies[firstKey];
    const nameEs = translateCurrency(curr.name);
    const simplified = simplifyCurrency(nameEs);
    return `${simplified} (${curr.symbol || ''})`;
};

/**
 * Evalúa la respuesta del usuario
 */
export const handleCurrencyAnswer = (selectedCurrencyString) => {
    const targetCurrency = getCurrencyString(state.currentQuestion.target);
    const isCorrect = selectedCurrencyString === targetCurrency;
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
        correctCurrency: targetCurrency,
        livesRemaining: state.lives
    };
};
