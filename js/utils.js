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

const TRANSLATIONS = {
    // Continentes
    "Africa": "África",
    "Antarctica": "Antártida",
    "Asia": "Asia",
    "Europe": "Europa",
    "North America": "América del Norte",
    "Oceania": "Oceanía",
    "South America": "América del Sur",
    
    // Subregiones
    "Northern Europe": "Europa del Norte",
    "Southern Europe": "Europa del Sur",
    "Western Europe": "Europa Occidental",
    "Eastern Europe": "Europa del Este",
    "Central Europe": "Europa Central",
    "Central America": "América Central",
    "Caribbean": "Caribe",
    "Western Asia": "Asia Occidental",
    "Eastern Asia": "Asia Oriental",
    "South-Eastern Asia": "Sudeste Asiático",
    "Southern Asia": "Asia del Sur",
    "Central Asia": "Asia Central",
    "Northern Africa": "África del Norte",
    "Western Africa": "África Occidental",
    "Eastern Africa": "África Oriental",
    "Southern Africa": "África del Sur",
    "Middle Africa": "África Central",
    "Australia and New Zealand": "Australia y Nueva Zelanda",
    "Melanesia": "Melanesia",
    "Micronesia": "Micronesia",
    "Polynesia": "Polinesia"
};

/**
 * Traduce un término geográfico al español
 */
export const translateGeo = (term) => {
    if (!term) return 'N/A';
    return TRANSLATIONS[term] || term;
};

/**
 * Formatea valores de moneda (PIB) a escala legible en español
 */
export const formatCurrency = (value) => {
    if (value === null || value === undefined) return "N/A";
    
    if (value >= 1.0e12) {
        return (value / 1.0e12).toFixed(2).replace('.', ',') + " Billones $";
    }
    if (value >= 1.0e9) {
        return (value / 1.0e9).toFixed(2).replace('.', ',') + " Mil Mill. $";
    }
    if (value >= 1.0e6) {
        return (value / 1.0e6).toFixed(2).replace('.', ',') + " Millones $";
    }
    
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'USD'
    }).format(value);
};
