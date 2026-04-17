export const DEFAULT_SETTINGS = {
    maxLives: 3,
    questionTime: 7,
    streakThreshold: 5,
    showFlagInCapitals: true,
    showAreaInPopulation: false,
    showGDPInPopulation: false,
    showFlagInCurrency: true,
    showDetailsInCurrency: true
};

export const state = {
    view: 'menu', // 'menu', 'game', 'results', 'settings'
    gameMode: null, // 'flags', 'capitals', 'population', 'currency'
    score: 0,
    lives: 0,
    streak: 0,
    countries: [],
    currentQuestion: null,
    history: [],
    settings: { ...DEFAULT_SETTINGS }
};

/**
 * Carga la configuración desde localStorage
 */
export const loadSettings = () => {
    const saved = localStorage.getItem('geosmart_settings');
    if (saved) {
        try {
            state.settings = { ...state.settings, ...JSON.parse(saved) };
        } catch (e) {
            console.error('Error al cargar ajustes:', e);
        }
    }
};

/**
 * Guarda la configuración en localStorage
 */
export const saveSettings = (newSettings) => {
    state.settings = { ...state.settings, ...newSettings };
    localStorage.setItem('geosmart_settings', JSON.stringify(state.settings));
};

/**
 * Restaura los ajustes por defecto
 */
export const resetSettings = () => {
    state.settings = { ...DEFAULT_SETTINGS };
    localStorage.removeItem('geosmart_settings');
};

/**
 * Reinicia el estado para una nueva partida
 */
export const resetState = () => {
    state.score = 0;
    state.lives = state.settings.maxLives; // Iniciamos con el máximo configurado
    state.history = [];
    state.currentQuestion = null;
};
