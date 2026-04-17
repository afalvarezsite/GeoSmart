/**
 * Estado global de la aplicación
 */
export const state = {
    view: 'menu', // 'menu', 'game', 'results'
    gameMode: null, // 'flags', 'capitals', 'population', 'currency'
    score: 0,
    lives: 3,
    countries: [],
    currentQuestion: null,
    history: []
};

export const resetState = () => {
    state.score = 0;
    state.lives = 3;
    state.history = [];
    state.currentQuestion = null;
};
