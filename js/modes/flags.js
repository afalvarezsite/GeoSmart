import { state } from '../state.js';
import { renderFlagQuestion } from '../ui.js';
import { shuffle } from '../utils.js';

/**
 * Inicializa el juego de banderas
 */
export const initFlagsGame = () => {
    state.score = 0;
    state.lives = 3;
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

/**
 * Evalúa la respuesta del usuario
 */
export const handleAnswer = (selectedCca3) => {
    const isCorrect = selectedCca3 === state.currentQuestion.target.cca3;
    
    if (isCorrect) {
        state.score += 10;
        // Actualizar UI de score si existe
        const scoreEl = document.getElementById('player-score');
        if (scoreEl) scoreEl.textContent = `Puntos: ${state.score}`;
    }

    // El feedback visual se maneja en ui.js mediante clases CSS
    return {
        isCorrect,
        correctCca3: state.currentQuestion.target.cca3
    };
};
