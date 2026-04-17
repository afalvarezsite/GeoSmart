/**
 * Utilidades generales para el juego
 */

/**
 * Mezcla un array aleatoriamente (Fisher-Yates)
 */
export const shuffle = (array) => {
    const list = [...array];
    for (let i = list.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
};

/**
 * Formatea un número con separadores de miles
 */
export const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
};
